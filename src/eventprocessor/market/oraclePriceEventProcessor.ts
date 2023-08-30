import {EventProcessor} from "../eventProcessor";
import {AddEventItem} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import {BatchBlock, BatchContext} from "@subsquid/substrate-processor";
import {Store} from "@subsquid/typeorm-store";
import {MarketOraclePriceEvent} from "../../types/events";
import {LatestOraclePrice, Market, OraclePrice} from "../../model";
import {Item} from "../../processor";

export class OraclePriceEventProcessor implements EventProcessor{
    getHandledItemName(): string {
        return "Market.OraclePrice";
    }

    async process(ctx: BatchContext<Store, AddEventItem<any, any>>, block: BatchBlock<Item>, item: AddEventItem<any, any>) {
        console.log('Oracle price event')
        let e = new MarketOraclePriceEvent(ctx, item.event)
        if (e.isV1) {
            const parsedEvent = e.asV1
            console.log(parsedEvent)
            await ctx.store.save(new OraclePrice({
                id: item.event.id,
                market: await ctx.store.get(Market, parsedEvent.market.toString()),
                price: parsedEvent.price,
                blockHeight: BigInt(block.header.height),
                timestamp: new Date(block.header.timestamp)
            }));
            await ctx.store.save(new LatestOraclePrice({
                id: parsedEvent.market.toString(),
                price: parsedEvent.price,
            }))
        } else {
            throw new Error('Unsupported spec')
        }
    }
}
