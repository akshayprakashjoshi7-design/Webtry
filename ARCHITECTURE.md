# Architecture — initial direction

The browser serves the presentation layer only. All sensitive operations must be enforced by server-side APIs. PostgreSQL will store normalized application data; project artifacts should use a storage service or constrained filesystem abstraction. Redis/BullMQ will schedule longer-running jobs. Code execution and terminal sessions must run in isolated worker environments, separate from the API process.

The first batch intentionally ships only the homepage and API foundation. Later batches should add one coherent vertical slice at a time, including tests and documentation, rather than scaffolding empty modules.
