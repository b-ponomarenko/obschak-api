import compose from '@tinkoff/utils/function/compose';
import filter from '@tinkoff/utils/array/filter';
import flatten from '@tinkoff/utils/array/flatten';
import map from '@tinkoff/utils/array/map';
import { Purchase } from '../entities/Purchase';
import { Transfer } from '../entities/Transfer';

const round = (value) => Number(value.toFixed(2));

const getDebtsFromPurchases = (purchases) =>
    purchases.map(({ creatorId, participants, value, currency }) => {
        const averageSum = round(value / participants.length);

        return participants.map((participantId) => ({
            from: participantId,
            to: creatorId,
            value: averageSum,
            currency,
        }));
    });

const unionDebts = (debts) =>
    Object.entries(
        debts.reduce((memo, { from, to, value, currency }) => {
            const userFrom = from > to ? from : to;
            const userTo = from > to ? to : from;
            const key = [userFrom, userTo].toString();
            const { value: currentValue = 0 } = memo[key] || {};

            return {
                ...memo,
                [key]: {
                    from: userFrom,
                    to: userTo,
                    currency,
                    value: round((from > to ? value : -value) + currentValue),
                },
            };
        }, {}),
    ).map(([, value]) => value);

export default (purchases: Purchase[], transfers: Transfer[] = []): any[] =>
    compose(
        map(({ from, to, currency, value }) => {
            if (value < 0) {
                return {
                    from: to,
                    to: from,
                    currency,
                    value: -value,
                };
            }

            return {
                from,
                to,
                currency,
                value,
            };
        }),
        filter(({ from, to, value }) => from !== to && value !== 0),
        (purchases: Purchase[]) =>
            unionDebts([
                ...purchases,
                ...transfers.map(({ from, to, ...rest }) => ({ ...rest, from: to, to: from })),
            ]),
        flatten,
        getDebtsFromPurchases,
    )(purchases);
