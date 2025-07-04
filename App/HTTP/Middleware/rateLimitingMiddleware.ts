import rateLimit from 'express-rate-limit';

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 40 requests per windowMs
  message: "Too many requests from this IP, please try again after some time"
});

export default limiter;
