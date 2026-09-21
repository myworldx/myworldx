import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston'
import { Resource } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
  instrumentations: [
    new WinstonInstrumentation({
      enabled: true,
      logHook: (_span, record) => {
        record['resource.service.name'] = 'service-name'
      },
    }),
  ],
})

export { sdk }
