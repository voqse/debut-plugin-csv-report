import { logger, LoggerOptions } from '@voqse/logger';
import { PluginInterface } from '@debut/types';
import { cli, file } from '@debut/plugin-utils';
import path from 'path';
import { stringify } from 'csv-stringify';
import { createWriteStream } from 'fs';

const pluginName = 'csvReport';

interface CsvReportMethodsInterface {
    addData(...data: any);
}

export interface CsvReportPluginOptions extends LoggerOptions {
    csvHeaders: string[];
}

export interface CsvReportPluginAPI {
    [pluginName]: CsvReportMethodsInterface;
}

export interface CsvReportPluginInterface extends PluginInterface {
    name: string;
    api: CsvReportMethodsInterface;
}

export function csvReportPlugin(opts: CsvReportPluginOptions): CsvReportPluginInterface {
    const log = logger(pluginName, opts);
    const csvStringify = stringify({ header: true, columns: opts.csvHeaders });

    let writeStream;

    return {
        name: pluginName,
        api: {
            addData(...data) {
                csvStringify.write(data);
            },
        },

        async onInit() {
            log.info('Initializing plugin...');

            const { ticker, interval } = this.debut.opts;
            const botData = await cli.getBotData(this.debut.getName())!;
            const savePath = `${botData?.src}/csv-report`;
            const datePrefix = new Date().toISOString().slice(0, 10);
            const saveFullPath = path.resolve(savePath, `report-${datePrefix}-${ticker}-${interval}.csv`);

            file.ensureFile(saveFullPath);
            writeStream = createWriteStream(saveFullPath);
        },

        async onDispose() {
            log.info('Shutting down plugin...');

            csvStringify.pipe(writeStream);
        },
    };
}
