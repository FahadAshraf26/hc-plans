import dotenv from 'dotenv';
dotenv.config();
import program from "commander";
import logger from "../App/Infrastructure/Logger/logger";
import CampaignService from "../App/Application/Campaign/CampaignService";
import container from '../App/Infrastructure/DIContainer/container';

const campaignService = container.get<CampaignService>(CampaignService)

program
  .command("campaign-expired-update-status")
  .alias("updateCampaignStatus")
  .description(
    "when a campaign expires, calculate their status i.e whether the campaign was successful or not"
  )
  .action(async () => {
    const connection = require("../App/Infrastructure/Database/mysqlConnection");
    logger.debug("start job");
    await campaignService.CampaignExpiredUpdateStatusHandler();
    await connection.close();
    logger.debug("end job");
    return;

  });

program
  .command("liked-campaign-expired-thirty-day")
  .alias("likedCampaignExpirationThirtyDay")
  .description("when a liked campaign expires, notify the user before thirty days")
  .action(async () => {
    const connection = require("../App/Infrastructure/Database/mysqlConnection");
    logger.debug("start job");
    await campaignService.LikedCampaigNotifyThirtyDayFromNow();
    await connection.close();
    logger.debug("end job");
    return;
  });

program
  .command("liked-campaign-expired-one-day")
  .alias("likedCampaignExpirationOneDay")
  .description("when a liked campaign expires, notify the user before one day")
  .action(async () => {
    const connection = require("../App/Infrastructure/Database/mysqlConnection");
    logger.debug("start job");
    await campaignService.LikedCampaigNotifyOneDayFromNow();
    await connection.close();
    logger.debug("end job");
    return;
  });

program.parse(process.argv);
