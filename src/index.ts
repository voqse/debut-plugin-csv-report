import { PluginInterface } from '@debut/types';
import { logger, LoggerOptions } from '@voqse/logger';

const pluginName = 'csvReport';

export interface CsvReportPluginOptions extends LoggerOptions {}

export interface SignalsMethodsInterface {
    broadcast(...data: any);
}

export interface CsvReportPluginAPI {
    [pluginName]: SignalsMethodsInterface;
}

export interface SignalsInterface extends PluginInterface {
    name: string;
    api: SignalsMethodsInterface;
}

export function csvReportPlugin(opts: CsvReportPluginOptions): SignalsInterface {
    const log = logger(pluginName, opts);

    return {
        name: pluginName,
        api: {
            broadcast(...data) {},
        },

        // async onInit() {
        //     log.info('Initializing plugin...');
        // },

        async onStart() {
            log.info('Starting Telegram Bot...');
        },

        // async onDispose() {
        //     log.info('Shutting down plugin...');
        // },
    };
}
