import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'Backend',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'debug',
      stream: process.stdout,
    },
    {
      level: 'error',
      stream: process.stderr,
    },
  ],
});

export default log;
