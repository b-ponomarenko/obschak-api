import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VkService } from '../vk/vk.service';
import { EventsService } from '../events/events.service';
import getDebtList from '../utils/getDebtList';
import { ConfigService } from '@nestjs/config';
import { addDays, startOfDay, isBefore } from 'date-fns';
import formatNumber from 'format-number';

const currencies = {
    RUB: '₽',
};

@Injectable()
export class TasksService {
    constructor(
        private vkService: VkService,
        private eventsService: EventsService,
        private configService: ConfigService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_2PM)
    async handleCron() {
        const now = new Date();
        const events = await this.eventsService
            .getEventsDeep()
            .then((events) =>
                events.filter(({ endDate }) =>
                    isBefore(addDays(startOfDay(new Date(endDate)), 1), now),
                ),
            );
        const purchases = events.map(({ purchases }) => purchases).flat();
        const transfers = events.map(({ transfers }) => transfers).flat();
        const debts = Object.values(
            getDebtList(purchases, transfers).reduce((memo, { from, currency, value }) => {
                if (memo[from]) {
                    return { ...memo, [from]: { from, currency, value: memo[from].value + value } };
                }

                return { ...memo, [from]: { from, currency, value } };
            }, {}),
        );

        await Promise.all(
            debts.map(({ from, currency, value }) =>
                this.vkService.vk.api.notifications
                    .sendMessage({
                        user_ids: [from],
                        message: `Вы должны вашим друзьям ${formatNumber({
                            integerSeparator: ' ',
                            decimal: ',',
                        })(value)} ${
                            currencies[currency]
                        }. Пожалуйста, выполните перевод и подтвердите это в приложении`,
                        access_token: this.configService.get('VK_TOKEN'),
                    })
                    .catch((e) => e),
            ),
        );
    }
}
