import { PlcCollector } from './plc/plc-collector';
import { RfidCollector } from './rfid/rfid-collector';

export const GlobalUse = {

    plcCollector: undefined as PlcCollector,
    
    rfidCollectorList: [] as RfidCollector[],

    rfidPingStarus: [] as number[],
}