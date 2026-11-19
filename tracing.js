
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

const { NodeSDK } = require('@opentelemetry/sdk-node');

const {
   getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

// OTLP exporter: sends spans over HTTP to the Jaeger all-in-one collector (port 4318)
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const {
   ConsoleMetricExporter,
   PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');

//Instrumentations
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

const sdk = new NodeSDK({
   resource: resourceFromAttributes({
       [ATTR_SERVICE_NAME]: "todo-service"
   }),

   traceExporter: new OTLPTraceExporter({
       url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || "http://localhost:4318/v1/traces",
   }),

   metricReader: new PeriodicExportingMetricReader({
       exporter: new ConsoleMetricExporter(),
       exportIntervalMillis: 10000,
   }),

   instrumentations: [
       getNodeAutoInstrumentations(),
       new ExpressInstrumentation(),
       new MongoDBInstrumentation(),
       new HttpInstrumentation()],
 });

sdk.start();
