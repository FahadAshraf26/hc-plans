import {
  IPaymentIntentSucceeded,
  IPaymentIntentSucceededId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentSucceeded/IPaymentIntentSucceeded';
import {
  ITransactionSaleFailureId,
  ITransactionSaleFailure,
} from '@application/Webhooks/USAEpay/TransactionSaleFailure/ITransactionSaleFailue';
import {
  IDeleteProjectionReturns,
  IDeleteProjectionReturnsId,
} from '@application/Campaign/DeleteProjectionReturns/IDeleteProjectionReturns';
import {
  ISendSubscriptionDocumentsUseCase,
  ISendSubscriptionDocumentsUseCaseId,
} from '@application/Campaign/sendSubscriptionDocuments/ISendSubscriptionDocumentsUseCase';
import {
  ICampaignNPAUseCase,
  ICampaignNPAUseCaseId,
} from '@application/CampaignDocument/CampaignNPA/ICampaignNPAUseCase';
import {
  IFundReturnRequestUseCase,
  IFundReturnRequestUseCaseId,
} from '@application/CampaignFund/FundReturnRequest/IFundRefturnRequestUseCase';
import {
  ICampaignPrincipleForgivenService,
  ICampaignPrincipleForgivenServiceId,
} from '@application/CampaignPrincipleForgiven/ICampaignPrincipleForgivenService';
import CampaignTagService from '@application/CampaignTag/CampaignTagService';
import {
  ICampaignTagService,
  ICampaignTagServiceId,
} from '@application/CampaignTag/ICamaignTagService';
import {
  IDwollaBusinessClassificationService,
  IDwollaBusinessClassificationServiceId,
} from '@application/DwollaBusinessClassification/IDwollaBusinessClassificationService';
import HoneycombDwollaOnDemandAuthorization from '@application/DwollaOnDemandAuthorization/HoneycombDwollaOnDemandAuthorizatonService';
import {
  IHoneycombDwollaOnDemandAuthorization,
  IHoneycombDwollaOnDemandAuthorizationId,
} from '@application/DwollaOnDemandAuthorization/IHoneycombDwollaOnDemandAuthorization';
import {
  ICreatePostBankTransactionsUseCase,
  ICreatePostBankTransactionsUseCaseId,
} from '@application/DwollaPostBankTransactions/CreatePostBankTransactionsUseCase/ICreatePostBankTransactionsUseCase';
import {
  IDwollaPostBankTransactionsService,
  IDwollaPostBankTransactionsServiceId,
} from '@application/DwollaPostBankTransactions/IDwollaPostBankTransactionsService';
import {
  ICreatePostTransactionsUseCase,
  ICreatePostTransactionsUseCaseId,
} from '@application/DwollaPostTransactions/CreatePostTransactionsUseCase/ICreatePostTransactionsUseCase';
import {
  IDwollaPostTransactionsService,
  IDwollaPostTransactionsServiceId,
} from '@application/DwollaPostTransactions/IDwollaPostTransactionsService';
import {
  ICreateDwollaPreBankTransactionsUsecase,
  ICreateDwollaPreBankTransactionsUsecaseId,
} from '@application/DwollaPreBankTransactions/CreateDwollaPreBankTransactionsUseCase/ICreateDwollaPreBankTransactionsUsecase';
import {
  IDwollaPreBankTransactionsService,
  IDwollaPreBankTransactionsServiceId,
} from '@application/DwollaPreBankTransactions/IDwollaPreBankTransactionService';
import {
  IReEvaluatePreBankTransactionsUseCase,
  IReEvaluatePreBankTransactionsUseCaseId,
} from '@application/DwollaPreBankTransactions/ReEvaluatePreBankTransactions/IReEvaluatePreBankTransactionsUseCase';
import {
  ICreateDwollaPreTransactionsUsecase,
  ICreateDwollaPreTransactionsUsecaseId,
} from '@application/DwollaPreTransactions/CreateDwollaPreTransactionsUsecase/ICreateDwollaPreTransactionsUsecase';
import {
  IDwollaPreTransactionsService,
  IDwollaPreTransactionsServiceId,
} from '@application/DwollaPreTransactions/IDwollaPreTransactionsService';
import {
  IReEvaluatePreTransactionsUseCase,
  IReEvaluatePreTransactionsUseCaseId,
} from '@application/DwollaPreTransactions/ReEvaluatePreTransactions/IReEvaluatePreTransactionsUseCase';
import {
  IDwollaToBankTransactionsService,
  IDwollaToBankTransactionsServiceId,
} from '@application/DwollaToBankTransactions/IDwollaToBankTransactionsService';
import {
  IHoneycombDwollaBeneficialOwnerService,
  IHoneycombDwollaBeneficialOwnerServiceId,
} from '@application/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerService';
import {
  IHoneycombDwollaConsentService,
  IHoneycombDwollaConsentServiceId,
} from '@application/HoneycombDwollaConsent/IHoneycombDwollaConsentService';
import {
  IHoneycombDwollaCustomerService,
  IHoneycombDwollaCustomerServiceId,
} from '@application/HoneycombDwollaCustomers/IHoneycombDwollaCustomerService';
import {
  IInvestorPaymentsService,
  IInvestorPaymentsServiceId,
} from '@application/Investor/InvestorPayments/IInvesterPaymentsService';
import InvestorPaymentsService from '@application/Investor/InvestorPayments/InvestorPaymentsService';
import {
  IProjectionReturnsService,
  IProjectionReturnsServiceId,
} from '@application/Investor/ProjectionReturns/IProjectionReturnsServcie';
import {
  IRepaymentsService,
  IRepaymentsServiceId,
} from '@application/Repayments/IRepaymentsService';
import {
  IRepaymentExportDataUseCase,
  IRepaymentExportDataUseCaseId,
} from '@application/Repayments/RepaymentExportUseCase/IRepaymentExportDataUseCase';
import {
  IAddPersonalVerifiedCustomer,
  IAddPersonalVerifiedCustomerId,
} from '@application/User/updateUser/IAddPersonalVerifiedCustomer';
import { IUserTransactionHistoryUsecaseId } from '@application/UserTransactionHistory/IUserTransactionHistoryUsecase';
import {
  IAdminRoleRepository,
  IAdminRoleRepositoryId,
} from '@domain/Core/AdminRole/IAdminRoleRepository';
import {
  IAdminUserRepository,
  IAdminUserRepositoryId,
} from '@domain/Core/AdminUser/IAdminUserRepository';
import {
  ICampaignMediaRepository,
  ICampaignMediaRepositoryId,
} from '@domain/Core/CamapignMedia/ICampaignMediaRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  ICampaignDocumentRepository,
  ICampaignDocumentRepositoryId,
} from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  ICampaignInfoRepository,
  ICampaignInfoRepositoryId,
} from '@domain/Core/CampaignInfo/ICampaignInfoRepository';
import {
  ICampaignNotificationRepository,
  ICampaignNotificationRepositoryId,
} from '@domain/Core/CampaignNotification/ICampaignNotification';
import {
  ICampaignPrincipleForgivenRepository,
  ICampaignPrincipleForgivenRepositoryId,
} from '@domain/Core/CampaignPrincipleForgiven/ICampaignPrincipleForgivenRepository';
import {
  ICampaignQARepository,
  ICampaignQARepositoryId,
} from '@domain/Core/CampaignQA/ICampaignQARepository';
import {
  ICampaignTagRepository,
  ICampaignTagRepositoryId,
} from '@domain/Core/CampaignTag/ICampaignTagRepository';
import {
  ICapitalRequestRepository,
  ICapitalRequestRepositoryId,
} from '@domain/Core/CapitalRequest/ICapitalRequestRepository';
import {
  IContactRepository,
  IContactRepositoryId,
} from '@domain/Core/Contact/IContactRepository';
import {
  IDwollaCustodyTransferHistoryRepository,
  IDwollaCustodyTransferHistoryRepositoryId,
} from '@domain/Core/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryRepository';
import {
  IDwollaPostBankTransactionsRepository,
  IDwollaPostBankTransactionsRepositoryId,
} from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';
import {
  IDwollaPostTransactionsRepository,
  IDwollaPostTransactionsRepositoryId,
} from '@domain/Core/DwollaPostTransactions/IDwollaPostTransactionsRepository';
import {
  IDwollaPreBankTransactionsRepository,
  IDwollaPreBankTransactionsRepositoryId,
} from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';
import {
  IDwollaPreTransactionsRepository,
  IDwollaPreTransactionsRepositoryId,
} from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import {
  IDwollaToBankTransactionsRepository,
  IDwollaToBankTransactionsRepositoryId,
} from '@domain/Core/DwollaToBankTransactions/IDwollaToBankTransactionsRepository';
import {
  IHoneycombDwollaBeneficialOwnerRepository,
  IHoneycombDwollaBeneficialOwnerRepositoryId,
} from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import {
  IHoneycombDwollaConsentRepository,
  IHoneycombDwollaConsentRepositoryId,
} from '@domain/Core/HoneycombDwollaConsent/IHoneycombDwollaConsentRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { IInvestorDao, IInvestorDaoId } from '@domain/Core/Investor/IInvestorDao';
import {
  IInvestorPaymentsRepository,
  IInvestorPaymentsRepositoryId,
} from '@domain/Core/InvestorPayments/IInvestorPaymentsRepository';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  INorthCapitalDocumentRepository,
  INorthCapitalDocumentRepositoryId,
} from '@domain/Core/NorthCapitalDocument/INorthCapitalDocumentRepository';
import { IOwnerDao, IOwnerDaoId } from '@domain/Core/Owner/IOwnerDao';
import { IProfilePicDao, IProfilePicDaoId } from '@domain/Core/ProfilePic/IProfilePicDao';
import {
  IProjectionReturnsRepository,
  IProjectionReturnsRepositoryId,
} from '@domain/Core/ProjectionReturns/IProjectionReturnsRepository';
import {
  IRepaymentsRepository,
  IRepaymentsRepositoryId,
} from '@domain/Core/Repayments/IRepaymentsRepository';
import {
  IRepaymentsUpdateRepository,
  IRepaymentsUpdateRepositoryId,
} from '@domain/Core/RepaymentsUpdate/IRepaymentsUpdateRepository';
import { ITagRepository, ITagRepositoryId } from '@domain/Core/Tag/ITagRepository';
import {
  ITransactionsHistoryRepository,
  ITransactionsHistoryRepositoryId,
} from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import {
  IUncaughtExceptionRepository,
  IUncaughtExceptionRepositoryId,
} from '@domain/Core/UncaughtException/IUncaughtExceptionRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IUserEventDao, IUserEventDaoId } from '@domain/Core/UserEvent/IUserEventDao';
import {
  IPreTransactionService,
  IPreTransactionServiceId,
} from '@domain/Services/IPreTransactionService';
import CampaignDocumentRepository from '@infrastructure/MySQLRepository/CampaignDocumentRepository';
import CampaignMediaRepository from '@infrastructure/MySQLRepository/CampaignMediaRepsoitory';
import CampaignQARespository from '@infrastructure/MySQLRepository/CampaignQARepository';
import CampaignRepository from '@infrastructure/MySQLRepository/CampaignRepository';
import CampaignTagRepository from '@infrastructure/MySQLRepository/CampaignTagRepository';
import DwollaPreTransactionsRepository from '@infrastructure/MySQLRepository/DwollaPreTransactionsRepository';
import IssuerRespository from '@infrastructure/MySQLRepository/IssuerRepository';
import { Container } from 'inversify';
import 'reflect-metadata';
import AdminRoleRepository from '@infrastructure/MySQLRepository/AdminRoleRepository';
import AdminUserRepository from '@infrastructure/MySQLRepository/AdminUserRepository';
import CampaignFundRespository from '@infrastructure/MySQLRepository/CampaignFundRepository';
import CampaignInfoRepository from '@infrastructure/MySQLRepository/CampaignInfoRepository';
import CapitalRequestRepository from '@infrastructure/MySQLRepository/CapitalRequestrepository';
import ContactRespository from '@infrastructure/MySQLRepository/ContactRepository';
import InvestorDAO from '@infrastructure/MySQLRepository/InvestorDAO';
import OwnerDAO from '@infrastructure/MySQLRepository/OwnerDAO';
import ProfilePicDAO from '@infrastructure/MySQLRepository/ProfilePicDAO';
import TagRepository from '@infrastructure/MySQLRepository/TagRepository';
import UncaughtExceptionRepository from '@infrastructure/MySQLRepository/UncaughtExceptionRepository';
import UserEventDAO from '@infrastructure/MySQLRepository/UserEventDAO';
import UserRepository from '@infrastructure/MySQLRepository/UserRepository';
import InvestorPaymentsRepository from '@infrastructure/MySQLRepository/InvestorPaymentsRepository';

import FindCampaignUseCase from '@application/Campaign/findCampaign/FindCampaignUseCase';
import {
  IFindCampaignUseCase,
  IFindCampaignUseCaseId,
} from '@application/Campaign/findCampaign/IFindCampaignUseCase';
import {
  IGetAllCampaignsUseCase,
  IGetAllCampaignsUseCaseId,
} from '@application/Campaign/getAllCampaigns/IGetAllCampaignsUseCase';
import GetAllCampaignsUseCase from '@application/Campaign/getAllCampaigns/getAllCampaignsUseCase';
import GetOwnerCampaignUseCase from '@application/Campaign/getOwnerCampaign/GetOwnerCampaignUseCase';
import {
  IGetOwnerCampaignUseCase,
  IGetOwnerCampaignUseCaseId,
} from '@application/Campaign/getOwnerCampaign/IGetOwnerCampaignUseCase';
import CampaignDocumentService from '@application/CampaignDocument/CampaignDocumentService';
import {
  ICampaignDocumentService,
  ICampaignDocumentServiceId,
} from '@application/CampaignDocument/ICampaignDocumentService';
import CampaignOwnerStoryService from '@application/CampaignOwnerStory/CampaignOwnerStoryService';
import {
  ICampaignOwnerStoryService,
  ICampaignOwnerStoryServiceId,
} from '@application/CampaignOwnerStory/ICampaignOwnerStoryService';
import CampaignQAService from '@application/CampaignQA/CampaignQAService';
import {
  ICampaignQAService,
  ICampaignQAServiceId,
} from '@application/CampaignQA/ICampaignQAService';
import CampaignQAReportService from '@application/CampaignQAReport/CampaignQAReportService';
import {
  ICampaignQAReportService,
  ICampaignQAReportServiceId,
} from '@application/CampaignQAReport/ICampaignQAReportService';
import CampaignRiskService from '@application/CampaignRisk/CampaignRiskService';
import {
  ICampaignRiskService,
  ICampaignRiskServiceId,
} from '@application/CampaignRisk/ICampaignRiskService';
import GetInvestorPaymentOptionsUseCase from '@application/InvestorBank/GeInvestorPaymentOptions/GeInvestorPaymentOptionsUseCase';
import {
  IGetInvestorPaymentOptionsUseCase,
  IGetInvestorPaymentOptionsUseCaseId,
} from '@application/InvestorBank/GeInvestorPaymentOptions/IGetInvestorPaymentOptionsUseCase';
import AddInvestorBankUseCase from '@application/InvestorBank/addInvestorPaymentOption/AddInvestorBankUseCase';
import {
  IAddInvestorBankUseCase,
  IAddInvestorBankUseCaseId,
} from '@application/InvestorBank/addInvestorPaymentOption/IAddInvestorBankUseCase';
import DeleteInvestorPaymentOptionUseCase from '@application/InvestorBank/deleteInvestorPaymentOption/DeleteInvestorPaymentOptionUseCase';
import {
  IDeleteInvestorPaymentOptionUseCase,
  IDeleteInvestorPaymentOptionUseCaseId,
} from '@application/InvestorBank/deleteInvestorPaymentOption/IDeleteInvestorPaymentOptionUseCase';
import CreateIssueUseCase from '@application/Issues/CreateIssue/CreateIssueUseCase';
import {
  ICreateIssueUseCase,
  ICreateIssueUseCaseId,
} from '@application/Issues/CreateIssue/ICreateIssueUseCase';
import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';
import UncaughtExceptionService from '@application/UncaughtException/UncaughtExceptionService';
import {
  ICampaignOwnerStoryRepository,
  ICampaignOwnerStoryRepositoryId,
} from '@domain/Core/CampaignOwnerStory/ICampaignOwnerStoryRepository';
import {
  ICampaignQAReportRepository,
  ICampaignQAReportRepositoryId,
} from '@domain/Core/CampaignQAReport/ICampaignQAReportRepository';
import {
  ICampaignRiskRepository,
  ICampaignRiskRepositoryId,
} from '@domain/Core/CampaignRisk/ICampaignRiskRepository';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import {
  IInvestorBankDAO,
  IInvestorBankDAOId,
} from '@domain/InvestorPaymentOptions/IInvestorBankDAO';
import {
  IInvestorCardDAO,
  IInvestorCardDAOId,
} from '@domain/InvestorPaymentOptions/IInvestorCardDAO';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import CampaignOwnerStoryRepository from '@infrastructure/MySQLRepository/CampaignOwnerStoryRepository';
import CampaignQAReportRepository from '@infrastructure/MySQLRepository/CampaignQAReportRepository';
import CampaignRiskRepository from '@infrastructure/MySQLRepository/CampaignRiskRepository';
import InvestorBankDAO from '@infrastructure/MySQLRepository/InvestorPaymentOptions/InvestorBankDAO';
import InvestorCardDAO from '@infrastructure/MySQLRepository/InvestorPaymentOptions/InvestorCardDAO';
import InvestorPaymentOptionsRepository from '@infrastructure/MySQLRepository/InvestorPaymentOptions/InvestorPaymentOptionsRepository';
import AdminDwollaService from '@application/AdminDwolla/AdminDwollaService';
import {
  IAdminDwollaService,
  IAdminDwollaServiceId,
} from '@application/AdminDwolla/IAdminDwollaService';
import {
  IReactivateUserAuthUseCase,
  IReactivateUserAuthUseCaseId,
} from '@application/Auth/reactivateUser/IReactivateUserAuthUseCase';
import ReactivateUserAuthUseCase from '@application/Auth/reactivateUser/ReactivateUserAuthUseCase';
import CampaignService from '@application/Campaign/CampaignService';
import DeleteProjectionReturns from '@application/Campaign/DeleteProjectionReturns/DeleteProjectionReturns';
import {
  ICampaignService,
  ICampaignServiceId,
} from '@application/Campaign/ICampaignService';
import CreateCampaignUseCase from '@application/Campaign/createCampaign/CreateCampaignUseCase';
import {
  ICreateCampaignUseCase,
  ICreateCampaignUseCaseId,
} from '@application/Campaign/createCampaign/ICreateCampaignUseCase';
import FindCampaignInfoUseCase from '@application/Campaign/findCampaignInfo/FindCampaignInfoUseCase';
import {
  IFindCampaignInfoUseCase,
  IFindCampaignInfoUseCaseId,
} from '@application/Campaign/findCampaignInfo/IFindCampaignInfoUseCase';
import SendSubscriptionDocumentsUseCase from '@application/Campaign/sendSubscriptionDocuments/SendSubscriptionDocumentsUseCase';
import CampaignNPAUseCase from '@application/CampaignDocument/CampaignNPA/CampaignNPAUseCase';
import CampaignEscrowBankService from '@application/CampaignEscrowBank/CampaignEscrowBankService';
import {
  ICampaignEscrowBankService,
  ICampaignEscrowBankServiceId,
} from '@application/CampaignEscrowBank/ICampaignEscrowBankService';
import CampaignFavoriteService from '@application/CampaignFavorite/CampaignFavoriteService';
import {
  ICampaignFavoriteService,
  ICampaignFavoriteServiceId,
} from '@application/CampaignFavorite/ICampaignFavoriteService';
import CampaignFundService from '@application/CampaignFund/CampaignFundService';
import FundReturnRequestUseCase from '@application/CampaignFund/FundReturnRequest/fundReturnRequestUseCase';
import {
  ICampaignFundService,
  ICampaignFundServiceId,
} from '@application/CampaignFund/ICampaignFundService';
import CreateCampaignFundUseCase from '@application/CampaignFund/createCampaignFund/CreateCampaignFundUseCase';
import {
  ICreateCampaignFundUseCase,
  ICreateCampaignFundUseCaseId,
} from '@application/CampaignFund/createCampaignFund/ICreateCampaignFundUseCase';
import BankCharge from '@application/CampaignFund/createCampaignFund/Utils/BankCharge';
import CampaignEvents from '@application/CampaignFund/createCampaignFund/Utils/CampaignEvents';
import CampaignFundNPA from '@application/CampaignFund/createCampaignFund/Utils/CampaignFundNPA';
import CampaignMeetsCriteria from '@application/CampaignFund/createCampaignFund/Utils/CampaignMeetsCriteria';
import CardCharge from '@application/CampaignFund/createCampaignFund/Utils/CardCharge';
import CheckTransactionLimit from '@application/CampaignFund/createCampaignFund/Utils/CheckTransactionLimit';
import FetchEntitiesFromDatabase from '@application/CampaignFund/createCampaignFund/Utils/FetchEntitiesFromDatabase';
import FundSlackNotification from '@application/CampaignFund/createCampaignFund/Utils/FundSlackNotification';
import HybridCharge from '@application/CampaignFund/createCampaignFund/Utils/HybridCharge';
import {
  IBankCharge,
  IBankChargeId,
} from '@application/CampaignFund/createCampaignFund/Utils/IBankCharge';
import {
  ICampaignEvents,
  ICampaignEventsId,
} from '@application/CampaignFund/createCampaignFund/Utils/ICampaignEvents';
import {
  ICampaignFundNPA,
  ICampaignFundNPAId,
} from '@application/CampaignFund/createCampaignFund/Utils/ICampaignFundNPA';
import {
  ICampaignMeetsCriteria,
  ICampaignMeetsCriteriaId,
} from '@application/CampaignFund/createCampaignFund/Utils/ICampaignMeetsCriteria';
import {
  ICardCharge,
  ICardChargeId,
} from '@application/CampaignFund/createCampaignFund/Utils/ICardCharge';
import {
  ICheckTransactionLimit,
  ICheckTransactionLimitId,
} from '@application/CampaignFund/createCampaignFund/Utils/ICheckTransactionLimit';
import {
  IFetchEntitiesFromDatabase,
  IFetchEntitiesFromDatabaseId,
} from '@application/CampaignFund/createCampaignFund/Utils/IFetchEntitiesFromDatabase';
import {
  IFundSlackNotification,
  IFundSlackNotificationId,
} from '@application/CampaignFund/createCampaignFund/Utils/IFundSlackNotification';
import {
  IHybridCharge,
  IHybridChargeId,
} from '@application/CampaignFund/createCampaignFund/Utils/IHybridCharge';
import {
  IInvestorMeetsCriteria,
  IInvestorMeetsCriteriaId,
} from '@application/CampaignFund/createCampaignFund/Utils/IInvestorMeetsCriteria';
import {
  IWalletCharge,
  IWalletChargeId,
} from '@application/CampaignFund/createCampaignFund/Utils/IWalletCharge';
import InvestorMeetsCriteria from '@application/CampaignFund/createCampaignFund/Utils/InvestorMeetsCriteria';
import WalletCharge from '@application/CampaignFund/createCampaignFund/Utils/WalletCharge';
import CampaignNewsService from '@application/CampaignNews/CampaingNewsService';
import {
  ICampaignNewsService,
  ICampaignNewsServiceId,
} from '@application/CampaignNews/ICampaignNewsService';
import CampaignNewsReportService from '@application/CampaignNewsReport/CampaignNewsReportService';
import {
  ICampaignNewsReportService,
  ICampaignNewsReportServiceId,
} from '@application/CampaignNewsReport/ICampaignNewsReportService';
import CampaignNotesService from '@application/CampaignNotes/CampaignNotesService';
import {
  ICampaignNotesService,
  ICampaignNotesServiceId,
} from '@application/CampaignNotes/ICampaignNotesService';
import CampaignNotificationService from '@application/CampaignNotification/CampaignNotificationService';
import {
  ICampaignNotificationService,
  ICampaignNotificationServiceId,
} from '@application/CampaignNotification/ICampaignNotificationService';
import CampaignOfferingChangeService from '@application/CampaignOfferingChange/CampaignOfferingChangeService';
import {
  ICampaignOfferingChangeService,
  ICampaignOfferingChangeServiceId,
} from '@application/CampaignOfferingChange/ICampaignOfferingChangeService';
import CampaignPLService from '@application/CampaignPL/CampaignPLService';
import {
  ICampaignPLService,
  ICampaignPLServiceId,
} from '@application/CampaignPL/ICampaignPLService';
import CampaignPrincipleForgivenService from '@application/CampaignPrincipleForgiven/CampaignPrincipleForgivenService';
import CampaignRoughBudgetService from '@application/CampaignRoughBudget/CampaignRoughBudgetService';
import {
  ICampaignRoughBudgetService,
  ICampaignRoughBudgetServiceId,
} from '@application/CampaignRoughBudget/ICampaignRoughBudgetService';
import DwollaBusinessClassificationService from '@application/DwollaBusinessClassification/DwollaBusinessClassificationService';
import DwollaFundingSourceVerificationService from '@application/DwollaFundingSourceVerification/DwollaFundingSourceVerificationService';
import {
  IDwollaFundingSourceVerificationService,
  IDwollaFundingSourceVerificationServiceId,
} from '@application/DwollaFundingSourceVerification/IDwollaFundingSourceVerificationService';
import CreatePostBankTransactionsUseCase from '@application/DwollaPostBankTransactions/CreatePostBankTransactionsUseCase/CreatePostBankTransactionsUseCase';
import DwollaPostBankTransactionsService from '@application/DwollaPostBankTransactions/DwollaPostBankTransactionsService';
import CreatePostTransactionsUseCase from '@application/DwollaPostTransactions/CreatePostTransactionsUseCase/CreatePostTransactionsUseCase';
import DwollaPostTransactionsService from '@application/DwollaPostTransactions/DwollaPostTransactionsService';
import CreateDwollaPreBankTransactionsUseCase from '@application/DwollaPreBankTransactions/CreateDwollaPreBankTransactionsUseCase/CreateDwollaPreBankTransactionsUseCase';
import DwollaPreBankTransactionsService from '@application/DwollaPreBankTransactions/DwollaPreBankTransactionsService';
import ReEvaluatePreBankTransactions from '@application/DwollaPreBankTransactions/ReEvaluatePreBankTransactions/ReEvaluatePreBankTransactionsUseCase';
import CreateDwollaPreTransactionsUsecase from '@application/DwollaPreTransactions/CreateDwollaPreTransactionsUsecase/CreateDwollaPreTransactionsUsecase';
import DwollaPreTransactionsService from '@application/DwollaPreTransactions/DwollaPreTransactionsService';
import ReEvaluatePreTransactionsUseCase from '@application/DwollaPreTransactions/ReEvaluatePreTransactions/ReEvaluatePreTransactionsUseCase';
import DwollaToBankTransactionsService from '@application/DwollaToBankTransactions/DwollaToBankTransactionsService';
import EmployeeService from '@application/Employee/EmployeeService';
import {
  IEmployeeService,
  IEmployeeServiceId,
} from '@application/Employee/IEmployeeService';
import EmployeeLogService from '@application/EmployeeLog/EmployeeLogService';
import {
  IEmployeeLogService,
  IEmployeeLogServiceId,
} from '@application/EmployeeLog/IEmployeeLogService';
import ExportDataService from '@application/ExportData/ExportDataService';
import {
  IExportDataService,
  IExportDataServiceId,
} from '@application/ExportData/IExportDataService';
import GlobalHoneycombConfigurationService from '@application/GlobalHoneycomConfiguration/GlobalHoneycombConfigurationService';
import {
  IGlobalHoneycombConfigurationService,
  IGlobalHoneycombConfigurationServiceId,
} from '@application/GlobalHoneycomConfiguration/IGlobalHoneycombConfigurationService';
import HoneycombDwollaBeneficialOwnerService from '@application/HoneycombDwollaBeneficialOwner/HoneycombDwollaBeneficialOwnerService';
import HoneycombDwollaConsentService from '@application/HoneycombDwollaConsent/HoneycombDwollaConsentService';
import HoneycombDwollaCustomerService from '@application/HoneycombDwollaCustomers/HoneycombDwollaCustomerService';
import ExportInvestorProjectionReturnsUseCase from '@application/Investor/ExportInvestorProjectionReturnsUseCase';
import ExportInvestorRateOfReturnUseCase from '@application/Investor/ExportInvestorRateOfReturnUseCase';
import {
  IExportInvestorProjectionReturnsUseCase,
  IExportInvestorProjectionReturnsUseCaseId,
} from '@application/Investor/IExportInvestorProjectionReturnsUseCase';
import {
  IExportInvestorRateOfReturnUseCase,
  IExportInvestorRateOfReturnUseCaseId,
} from '@application/Investor/IExportInvestorRateOfReturnUseCase';
import ProjectionReturnsService from '@application/Investor/ProjectionReturns/ProjectionReturnsService';
import {
  ILinkCreditCardService,
  ILinkCreditCardServiceId,
} from '@application/InvestorBank/linkCreditCard/ILinkCreditCardService';
import LinkCreditCardService from '@application/InvestorBank/linkCreditCard/LinkCreditCardService';
import {
  IInvitationService,
  IInvitationServiceId,
} from '@application/Invitation/IInvitationService';
import InvitationService from '@application/Invitation/InvitationService';
import { IIssuerService, IIssuerServiceId } from '@application/Issuer/IIssuerService';
import IssuerService from '@application/Issuer/IssuerService';
import CreateIssuerUseCase from '@application/Issuer/createIssuer/CreateIssuerUseCase';
import {
  ICreateIssuerUseCase,
  ICreateIssuerUseCaseId,
} from '@application/Issuer/createIssuer/ICreateIssuerUseCase';
import {
  IIssuerBankService,
  IIssuerBankServiceId,
} from '@application/IssuerBank/IIssuerBankService';
import IssuerBankService from '@application/IssuerBank/IssuerBankService';
import {
  IIssuerDocumentService,
  IIssuerDocumentServiceId,
} from '@application/IssuerDocument/IIssuerDocumentService';
import IssuerDocumentService from '@application/IssuerDocument/IssuerDocumentService';
import { INAICService, INAICServiceId } from '@application/NAIC/INAICService';
import NAICService from '@application/NAIC/NAICService';
import {
  INorthCapitalDocumentService,
  INorthCapitalDocumentServiceId,
} from '@application/NorthCapitalDocuments/INorthCapitalDocumentService';
import NorthCapitalDocumentService from '@application/NorthCapitalDocuments/NorthCapitalDocumentService';
import {
  IPushNotificationService,
  IPushNotificationServiceId,
} from '@application/PushNotifications/IPushNotificationService';
import PushNotificationService from '@application/PushNotifications/PushNotificationService';
import {
  ISendBusinessUpdateNotificationsUseCase,
  ISendBusinessUpdateNotificationsUseCaseId,
} from '@application/PushNotifications/sendBusinessUpdateNotifications/ISendBusinessUpdateNotificationsUseCase';
import SendBusinessUpdateNotificationsUseCase from '@application/PushNotifications/sendBusinessUpdateNotifications/SendBusinessUpdateNotificationsUseCase';
import {
  ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase,
  ISendLikedCampaignExpirationNotifyBeforeOneDayUseCaseId,
} from '@application/PushNotifications/sendLikedCampaignExpirationNotifyBeforeOneDay/ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase';
import SendLikedCampaignExpirationNotifyBeforeOneDayUseCase from '@application/PushNotifications/sendLikedCampaignExpirationNotifyBeforeOneDay/SendLikedCampaignExpirationNotifyBeforeOneDayUseCase';
import {
  ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase,
  ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCaseId,
} from '@application/PushNotifications/sendLikedCampaignExpirationNotifyBeforeThirtyDays/ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase';
import SendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase from '@application/PushNotifications/sendLikedCampaignExpirationNotifyBeforeThirtyDays/SendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase';
import {
  ISendNewCampaignNotificationsUseCase,
  ISendNewCampaignNotificationsUseCaseId,
} from '@application/PushNotifications/sendNewCampaignNotifications/ISendNewCampaignNotificationsUseCase';
import SendNewCampaignNotificationsUseCase from '@application/PushNotifications/sendNewCampaignNotifications/SendNewCampaignNotificationsUseCase';
import {
  ISendUserNotifyAddPersonalDetailUseCase,
  ISendUserNotifyAddPersonalDetailUseCaseId,
} from '@application/PushNotifications/sendUserNotifyAddPersonalDetail/ISendUserNotifyAddPersonalDetailUseCase';
import SendUserNotifyAddPersonalDetailUseCase from '@application/PushNotifications/sendUserNotifyAddPersonalDetail/SendUserNotifyAddPersonalDetailUseCase';
import {
  IPushUpdateService,
  IPushUpdateServiceId,
} from '@application/PushUpdate/IPushUpdateService';
import PushUpdateService from '@application/PushUpdate/PushUpdateService';
import RepaymentExportDataUseCase from '@application/Repayments/RepaymentExportUseCase/RepaymentExportDataUseCase';
import RepaymentsService from '@application/Repayments/RepaymentsService';
import { IToSService, IToSServiceId } from '@application/ToS/IToSService';
import ToSService from '@application/ToS/ToSService';
import {
  IGetUserToSUseCase,
  IGetUserToSUseCaseId,
} from '@application/ToS/getUserToS/IGetUserToSUseCase';
import GetUserToS from '@application/ToS/getUserToS/getUserToS';
import ExportEducationalDataUsecase from '@application/User/ExportEducationalData/ExportEducationalDataUsecase';
import {
  IExportEducationalDataUsecase,
  IExportEducationalDataUsecaseId,
} from '@application/User/ExportEducationalData/IExportEducationalDataUsecase';
import ExportUserUseCase from '@application/User/ExportUser/ExportUserDataUseCase';
import {
  IExportUserDataUseCase,
  IExportUserDataUseCaseId,
} from '@application/User/ExportUser/IExportUserDataUseCase';
import { IUserService, IUserServiceId } from '@application/User/IUserService';
import UserService from '@application/User/UserService';
import CheckEmailAvailabilityUseCase from '@application/User/checkEmailAvailability/CheckEmailAvailabilityUseCase';
import {
  ICheckEmailAvaliabilityUseCase,
  ICheckEmailAvaliabilityUseCaseId,
} from '@application/User/checkEmailAvailability/ICheckEmailAvaliabilityUseCase';
import DeactivateUserUseCase from '@application/User/deactivateUser/DeactivateUserUseCase';
import {
  IDeactivateUserUseCase,
  IDeactivateUserUseCaseId,
} from '@application/User/deactivateUser/IDeactivateUserUseCase';
import DisabledIdVerifiedPromptUseCase from '@application/User/disableIdVerifiedPrompt/DisabledIdVerifiedPromptUseCase';
import {
  IDisableIdVerifiedPromptUseCase,
  IDisableIdVerifiedPromptUseCaseId,
} from '@application/User/disableIdVerifiedPrompt/IDisableIdVerifiedPromptUseCase';
import DisablePortfolioVisitedPromptUseCase from '@application/User/disablePortfolioVisitedPrompt.js/DisablePortfolioVisitedPromptUseCase';
import {
  IDisablePortfolioVisitedPromptUseCase,
  IDisablePortfolioVisitedPromptUseCaseId,
} from '@application/User/disablePortfolioVisitedPrompt.js/IDisablePortfolioVisitedPromptUseCase';
import DoKycCheckUseCase from '@application/User/doKycCheck/DoKycCheckUseCase';
import {
  IDoKycCheckUseCaseId,
  IDokycCHeckUseCase,
} from '@application/User/doKycCheck/IDoKycCheckUseCase';
import GetFavoriteCampaignUseCase from '@application/User/getFavoriteCampaign/GetFavoriteCampaignUseCase';
import {
  IGetFavoriteCampaignUseCase,
  IGetFavoriteCampaignUseCaseId,
} from '@application/User/getFavoriteCampaign/IGetFavoriteCampaignUseCase';
import {
  ITotalInvestedAmountUseCase,
  ITotalInvestedAmountUseCaseId,
} from '@application/User/getTotalInvestedAmount/ITotalInvestedAmountUseCase';
import TotalInvestedAmountUseCase from '@application/User/getTotalInvestedAmount/TotalInvestedAmountUseCase';
import {
  IGetUsersEmailByCategoryUseCase,
  IGetUsersEmailByCategoryUseCaseId,
} from '@application/User/getUsersEmail/IGetUsersEmailByCategoryUseCase';
import getUsersEmailByCategoryUseCase from '@application/User/getUsersEmail/getUsersEmailByCategoryUseCase';
import {
  IInitiateAccreditationUseCase,
  IInitiateAccreditationUseCaseId,
} from '@application/User/initiateAccreditation/IInitiateAccreditationUseCase';
import InitiateAccreditationUseCase from '@application/User/initiateAccreditation/InitiateAccreditationUseCase';
import {
  IOptInOfEmailUseCase,
  IOptInOfEmailUseCaseId,
} from '@application/User/optInOfEmail/IOptInOfEmailUseCase';
import OptInOfEmailUseCase from '@application/User/optInOfEmail/OptInOfEmailUseCase';
import {
  IOptOutOfEmailUseCase,
  IOptOutOfEmailUseCaseId,
} from '@application/User/optOutOfEmail/IOptOutOfEmailUseCase';
import OptOutOfEmailUseCase from '@application/User/optOutOfEmail/OptOutOfEmailUseCase';
import {
  IPlaidLinkTokenUseCase,
  IPlaidLinkTokenUseCaseId,
} from '@application/User/plaidLinkToken/IPlaidLinkTokenUseCase';
import PlaidLinkTokenUseCase from '@application/User/plaidLinkToken/PlaidLinkTokenUseCase';
import {
  IReactivateUserUseCase,
  IReactivateUserUseCaseId,
} from '@application/User/reactivateUser/IReactivateUserUseCase';
import ReactivateUserUseCase from '@application/User/reactivateUser/ReactivateUserUseCase';
import {
  ISendEmailVerificationLinkUseCase,
  ISendEmailVerificationLinkUseCaseId,
} from '@application/User/sendEmailVerificationLink/ISendEmailVerificationLinkUseCase';
import SendEmailVerificationLinkUseCase from '@application/User/sendEmailVerificationLink/SendEmailVerificationLinkUseCase';
import {
  ISendGlobalNotificationUseCase,
  ISendGlobalNotificationUseCaseId,
} from '@application/User/sendGlobalNotification/ISendGlobalNotificationUseCase';
import SendGlobalNotificationUseCase from '@application/User/sendGlobalNotification/SendGlobalNotificationUseCase';
import {
  ISubmitContactRequestUseCase,
  ISubmitContactRequestUseCaseId,
} from '@application/User/submitContactRequest/ISubmitContactRequestUseCase';
import SubmitContactRequestUseCase from '@application/User/submitContactRequest/SubmitContactRequestUseCase';
import {
  ISubmitFeedbackUseCase,
  ISubmitFeedbackUseCaseId,
} from '@application/User/submitFeedback/ISubmitFeedbackUseCase';
import SubmitFeedbackUseCase from '@application/User/submitFeedback/SubmitFeedbackUseCase';
import {
  ISummaryUseCase,
  ISummaryUseCaseId,
} from '@application/User/summary/ISummaryUseCase';
import SummaryUseCase from '@application/User/summary/SummaryUseCase';
import AddPersonalVerifiedCustomer from '@application/User/updateUser/AddPersonalVerifiedCustomer';
import {
  IUpdateUserUseCase,
  IUpdateUserUseCaseId,
} from '@application/User/updateUser/IUpdateUserUseCase';
import UpdateUserUseCase from '@application/User/updateUser/UpdateUserUseCase';
import CreateNCAccount from '@application/User/doKycCheck/Utils/CreateNCAccount';
import CreateUSAEPayAccount from '@application/User/doKycCheck/Utils/CreateUSAEPayAccount';
import {
  ICreateNCAccount,
  ICreateNCAccountId,
} from '@application/User/doKycCheck/Utils/ICreateNCAccount';
import {
  ICreateUSAEPayAccount,
  ICreateUSAEPayAccountId,
} from '@application/User/doKycCheck/Utils/ICreateUSAEPayAccount';
import {
  IUpdateUserNewPasswordUseCase,
  IUpdateUserNewPasswordUseCaseId,
} from '@application/User/updateUserPassword/IUpdateUserNewPasswordUseCase';
import {
  IUpdateUserPasswordUseCase,
  IUpdateUserPasswordUseCaseId,
} from '@application/User/updateUserPassword/IUpdateUserPasswordUseCase';
import {
  IUpdatePasswordWithCurrentPasswordUseCase,
  IUpdatePasswordWithCurrentPasswordUseCaseId,
} from '@application/User/updateUserPassword/IUpdatePasswordWithCurrentPasswordUseCase';
import UpdateUserNewPasswordUseCase from '@application/User/updateUserPassword/UpdateUserNewPasswordUseCase';
import UpdateUserPasswordUseCase from '@application/User/updateUserPassword/UpdateUserPasswordUseCase';
import {
  IUpdateUserProfilePicture,
  IUpdateUserProfilePictureId,
} from '@application/User/updateUserProfilePicture/IUpdateUserProfilePicture';
import UpdateUserProfilePicture from '@application/User/updateUserProfilePicture/updateUserProfilePicture';
import {
  IUploadUserIdUseCase,
  IUploadUserIdUseCaseId,
} from '@application/User/uploadUserId/IUploadUserIdUseCase';
import UploadUserIdUseCase from '@application/User/uploadUserId/UploadUserIdUseCase';
import {
  IUploadVoidedCheckUseCase,
  IUploadVoidedCheckUseCaseId,
} from '@application/User/uploadVoidedCheck/IUploadVoidedCheckUseCase';
import UploadVoidedCheckUseCase from '@application/User/uploadVoidedCheck/UploadVoidedCheckUseCase';
import {
  IVerifySsnUseCase,
  IVerifySsnUseCaseId,
} from '@application/User/verifySsn/IVerifySsnUseCase';
import VerifySsnUseCase from '@application/User/verifySsn/VerifySsnUseCase';
import {
  IUserAppFeedback,
  IUserAppFeedbackService,
} from '@application/UserAppFeedback/IUserAppFeedback';
import UserAppFeedbackService from '@application/UserAppFeedback/UserAppFeedbackService';
import {
  IUserDocumentService,
  IUserDocumentServiceId,
} from '@application/UserDocument/IUserDocumentService';
import UserDocumentService from '@application/UserDocument/UserDocumentService';
import {
  IUserEventService,
  IUserEventServiceId,
} from '@application/UserEvents/IUserEventService';
import UserEventService from '@application/UserEvents/UserEventService';
import {
  IUserMediaService,
  IUserMediaServiceId,
} from '@application/UserMedia/IUserMediaService';
import UserMediaService from '@application/UserMedia/UserMediaService';
import { IUserTransactionHistoryUsecase } from '@application/UserTransactionHistory/IUserTransactionHistoryUsecase';
import UserTransactionHistoryHistoryUsecase from '@application/UserTransactionHistory/UserTransactionHistoryUsecase';
import {
  IWebhookService,
  IWebhookServiceId,
} from '@application/Webhooks/IWebhookService';
import HandleNorthCapitalWebhookUseCase from '@application/Webhooks/NorthCapital/handleNorthCapitalWebhook/HandleNorthCapitalWebhookUseCase';
import {
  IHandleNorthCapitalWebhookUseCase,
  IHandleNorthCapitalWebhookUseCaseId,
} from '@application/Webhooks/NorthCapital/handleNorthCapitalWebhook/IHandleNorthCapitalWebhookUseCase';
import {
  INorthCapitalEventHandlerFactory,
  INorthCapitalEventHandlerFactoryId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/INorthCapitalEventHandlerFactory';
import NorthCapitalEventHandlerFactory from '@application/Webhooks/NorthCapital/webhookHandlers/NorthCapitalEventHandlerFactory';
import CreateAccountWebhookHandler from '@application/Webhooks/NorthCapital/webhookHandlers/createAccountWebhookHandler/CreateAccountWebhookHandler';
import {
  ICreateAccountWebhookHandler,
  ICreateAccountWebhookHandlerId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/createAccountWebhookHandler/ICreateAccountWebhookHandler';
import CreatePartyWebhookHandler from '@application/Webhooks/NorthCapital/webhookHandlers/createPartyWebhookHandler/CreatePartyWebhookHandler';
import {
  ICreatePartyWebhookHandler,
  ICreatePartyWebhookHandlerId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/createPartyWebhookHandler/ICreatePartyWebhookHandler';
import CreateTradeWebhookHandler from '@application/Webhooks/NorthCapital/webhookHandlers/createTradeWebhookHandler/CreateTradeWebhookHandler';
import {
  ICreateTradeWebhookHandler,
  ICreateTradeWebhookHandlerId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/createTradeWebhookHandler/ICreateTradeWebhookHandler';
import {
  IUpdateAiVerificationWebhookHandler,
  IUpdateAiVerificationWebhookHandlerId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/updateAiVerificationWebhookHandler/IUpdateAiVerificationWebhookHandler';
import UpdateAiVerificationWebhookHandler from '@application/Webhooks/NorthCapital/webhookHandlers/updateAiVerificationWebhookHandler/UpdateAiVerificationWebhookHandler';
import {
  IUpdateBankFundMoveStatusWebhookHandler,
  IUpdateBankFundMoveStatusWebhookHandlerId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/updateBankFundMoveStatusWebhookHandler/IUpdateBankFundMoveStatusWebhookHandler';
import UpdateBankFundMoveStatusWebhookHandler from '@application/Webhooks/NorthCapital/webhookHandlers/updateBankFundMoveStatusWebhookHandler/UpdateBankFundMoveStatusWebhookHandler';
import {
  IUpdateCCFundMoveStatusWebhookHandler,
  IUpdateCCFundMoveStatusWebhookHandlerId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/updateCCFundMoveStatusWebhookHandler/IUpdateCCFundMoveStatusWebhookHandler';
import UpdateCCFundMoveStatusWebhookHandler from '@application/Webhooks/NorthCapital/webhookHandlers/updateCCFundMoveStatusWebhookHandler/UpdateCCFundMoveStatusWebhookHandler';
import {
  IUpdateTradeStatusWebhookHandler,
  IUpdateTradeStatusWebhookHandlerId,
} from '@application/Webhooks/NorthCapital/webhookHandlers/updateTradeStatusWebhookHandler/IUpdateTradeStatusWebhookHandler';
import UpdateTradeStatusWebhookHandler from '@application/Webhooks/NorthCapital/webhookHandlers/updateTradeStatusWebhookHandler/UpdateTradeStatusWebhookHandler';
import WebhookService from '@application/Webhooks/WebhookService';
import {
  ICampaignEscrowBankRepository,
  ICampaignEscrowBankRepositoryId,
} from '@domain/Core/CampaignEscrowBank/ICampaignEscrowBankRepository';
import {
  ICampaignHoneycombChargeFeeId,
  ICampaignHoneycombChargeFeeRepository,
} from '@domain/Core/CampaignHoneycombChargeFee/ICampaignHoneycombChargeFeeRepository';
import {
  ICampaignNewsRepository,
  ICampaignNewsRepositoryId,
} from '@domain/Core/CampaignNews/ICampaignNewsRepository';
import {
  ICampaignNewsMediaDAO,
  ICampaignNewsMediaDaoId,
} from '@domain/Core/CampaignNewsMedia/ICampaignNewsMediaDAO';
import {
  ICampaignNewsReportRepository,
  ICampaignNewsReportRepositoryId,
} from '@domain/Core/CampaignNewsReport/ICampaignNewsReportRepository';
import {
  ICampaignNotesRepository,
  ICampaignNotesRepositoryId,
} from '@domain/Core/CampaignNotes/ICampaignNotesRepository';
import {
  ICampaignOfferingChangeRepository,
  ICampaignOfferingChangeRepositoryId,
} from '@domain/Core/CampaignOfferingChange/ICampaignOfferingChangeRepository';
import {
  ICampaignPLRepository,
  ICampaignPLRepositoryId,
} from '@domain/Core/CampaignPL/ICampaignPLRepository';
import {
  ICampaignRoughBudgetRepository,
  ICampaignRoughBudgetRepositoryId,
} from '@domain/Core/CampaignRoughBudget/ICampaignRoughBudgetRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IDwollaFundingSourceVerificationRepository,
  IDwollaFundingSourceVerificationRepositoryId,
} from '@domain/Core/DwollaFundingSourceVerification/IDwollaFundingSourceVerificationRepository';
import {
  IEmployeeRepository,
  IEmployeeRepositoryId,
} from '@domain/Core/Employee/IEmployeeRepository';
import {
  IEmployeeLogRepository,
  IEmployeeLogRepositoryId,
} from '@domain/Core/EmployeeLog/IEmployeeLogRepository';
import {
  IEntityAccreditationRepository,
  IEntityAccreditationRepositoryId,
} from '@domain/Core/EntityAccreditation/IEntityAccreditationRepository';
import {
  IEntityCampaignFundRepository,
  IEntityCampaignFundRepositoryId,
} from '@domain/Core/EntityCampaignFund/IEntityCampaignFundRepository';
import {
  IEntityIntermediaryRepository,
  IEntityIntermediaryRepositoryId,
} from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import {
  IExportDataRepository,
  IExportDataRepositoryId,
} from '@domain/Core/ExportData/IExportDataRepository';
import {
  IGlobalHoneycombConfigurationRepository,
  IGlobalHoneycombConfigurationRepositoryId,
} from '@domain/Core/GlobalHoneycombConfiguration/IGlobalHoneycombConfigurationRepository';
import { IDwollaWebhookDAO, IDwollaWebhookDAOId } from '@domain/Core/IDwollaWebhookDAO';
import {
  IIdologyTimestampDAO,
  IIdologyTimestampDAOId,
} from '@domain/Core/IdologyTimestamp/IIdologyTimestampDAO';
import {
  IPlaidIDVUseCase,
  IPlaidIDVUseCaseId,
} from '@application/User/doKycCheck/IPlaidIDVUseCase';
import PlaidIDVUseCase from '@application/User/doKycCheck/PlaidIDVUseCase';
import {
  IInvestorAccreditationDAO,
  IInvestorAccreditationDAOId,
} from '@domain/Core/InvestorAccreditation/IInvestorAccreditationDAO';
import {
  IInvitationRepository,
  IInvitationRepositoryId,
} from '@domain/Core/Invitation/IInvitationRepository';
import {
  IIssuerBankRepository,
  IIssuerBankRepositoryId,
} from '@domain/Core/IssuerBank/IIssuerBankRepository';
import {
  IIssuerDocumentRepository,
  IIssuerDocumentRepositoryId,
} from '@domain/Core/IssuerDocument/IIssuerDocumentRepository';
import {
  IIssuerOwnerDAO,
  IIssuerOwnerDAOId,
} from '@domain/Core/IssuerOwner/IIssuerOwnerDAO';
import {
  IIssueRepository,
  IIssueRepositoryId,
} from '@domain/Core/Issues/IIssueRepository';
import { INAICRepository, INAICRepositoryId } from '@domain/Core/NAIC/INAICRepository';
import {
  IPushNotificationDAO,
  IPushNotificationDAOId,
} from '@domain/Core/PushNotification/IPushNotificationDAO';
import {
  IReleaseRepository,
  IReleaseRepositoryId,
} from '@domain/Core/Release/IReleaseRepository';
import { IToSRepository, IToSRepositoryId } from '@domain/Core/ToS/IToSRepository';
import {
  IUserAppFeedbackDAO,
  IUserAppFeedbackDAOId,
} from '@domain/Core/UserAppFeedBack/IUserAppFeedbackDAO';
import {
  IUserDocumentRepository,
  IUserDocumentRepositoryId,
} from '@domain/Core/UserDocument/IUserDocumentRepository';
import {
  IUserMediaRepository,
  IUserMediaRepositoryId,
} from '@domain/Core/UserMedia/IUserMediaRepository';
import {
  INorthCapitalWebhookRepository,
  INorthCapitalWebhookRepositoryId,
} from '@domain/NorthCapitalWebhooks/INorthCapitalWebhookRepository';
import PreTransactionService from '@domain/Services/PreTransactionService';
import {
  IInMemoryAsyncEventBus,
  IInMemoryAsyncEventBusId,
} from '@infrastructure/EventBus/InMemory/IInMemoryAsyncEventBus';
import InMemoryAsyncEventBus from '@infrastructure/EventBus/InMemory/InMemoryAsyncEventBus';
import CampaignEscrowBankRepository from '@infrastructure/MySQLRepository/CampaignEscrowBankRepository';
import CampaignHoneycombChargeFeeRepository from '@infrastructure/MySQLRepository/CampaignHoneycombChargeFeeRepository';
import CampaignNewsMediaDAO from '@infrastructure/MySQLRepository/CampaignNewsMediaDAO';
import CampaignNewsReportRepository from '@infrastructure/MySQLRepository/CampaignNewsReportRepository';
import CampaignNewsRepository from '@infrastructure/MySQLRepository/CampaignNewsRepository';
import CampaignNotesRepository from '@infrastructure/MySQLRepository/CampaignNotesRepository';
import CampaignNotificationRepository from '@infrastructure/MySQLRepository/CampaignNotificationRepository';
import CampaignOfferingChangeRepository from '@infrastructure/MySQLRepository/CampaignOfferingChangeRepository';
import CampaignPLRepository from '@infrastructure/MySQLRepository/CampaignPLRepository';
import CampaignPrincipleForgivenRepository from '@infrastructure/MySQLRepository/CampaignPrincipleForgivenRepository';
import CampaignRoughBudgetRepository from '@infrastructure/MySQLRepository/CampaignRoughBudgetRepository';
import ChargeRepository from '@infrastructure/MySQLRepository/ChargeRepository';
import DwollaFundingSourceVerificationRepository from '@infrastructure/MySQLRepository/DwollaFundingSourceVerificationRepository';
import DwollaPostBankTransactionsRepository from '@infrastructure/MySQLRepository/DwollaPostBankTransactionsRepository';
import DwollaPostTransactionsRepository from '@infrastructure/MySQLRepository/DwollaPostTransactionsRepository';
import DwollaPreBankTransactionsRepository from '@infrastructure/MySQLRepository/DwollaPreBankTransactionsRepository';
import DwollaToBankTransactionsRepository from '@infrastructure/MySQLRepository/DwollaToBankTransactionsRepository';
import DwollaWebhookDAO from '@infrastructure/MySQLRepository/DwollaWebhookDAO';
import EmployeeLogRepository from '@infrastructure/MySQLRepository/EmployeeLogRepository';
import EmployeeRepository from '@infrastructure/MySQLRepository/EmployeeRepository';
import EntityAccreditationRepository from '@infrastructure/MySQLRepository/EntityAccreditationRepository';
import EntityCampaignFundRepository from '@infrastructure/MySQLRepository/EntityCampaignFundRepository';
import EntityIntermediaryRepository from '@infrastructure/MySQLRepository/EntityIntermediaryRepository';
import ExportDataRepository from '@infrastructure/MySQLRepository/ExportDataRepository';
import FavoriteCampaignRepository from '@infrastructure/MySQLRepository/FavoriteCampaignRepository';
import GlobalHoneycombConfigurationRepository from '@infrastructure/MySQLRepository/GlobalHoneycombConfigurationRepository';
import HoneycombDwollaBeneficialOwnerRepository from '@infrastructure/MySQLRepository/HoneycombDwollaBeneficialOwnerRepository';
import HoneycombDwollaConsentRepository from '@infrastructure/MySQLRepository/HoneycombDwollaConsentRepository';
import HoneycombDwollaCustomerRepository from '@infrastructure/MySQLRepository/HoneycombDwollaCustomerRepository';
import HybridTransactionRepository from '@infrastructure/MySQLRepository/HybridTransactionRepository';
import IdologyTimestampDAO from '@infrastructure/MySQLRepository/IdologyTimestampDAO';
import InvestorAccreditationDAO from '@infrastructure/MySQLRepository/InvestorAccreditationDAO';
import InvitationRepository from '@infrastructure/MySQLRepository/InvitationRepository';
import IssueRepository from '@infrastructure/MySQLRepository/IssueRepository';
import IssuerBankRepository from '@infrastructure/MySQLRepository/IssuerBankRepository';
import IssuerDocumentRepository from '@infrastructure/MySQLRepository/IssuerDocumentRepository';
import IssuerOwnerDAO from '@infrastructure/MySQLRepository/IssuerOwnerDAO';
import NAICRepository from '@infrastructure/MySQLRepository/NAICRepository';
import NorthCapitalDocumentRepository from '@infrastructure/MySQLRepository/NorthCapitalDocumentRepository';
import NorthCapitalWebhookRepository from '@infrastructure/MySQLRepository/NorthCapitalWebhookRepository';
import ProjectionReturnsRepository from '@infrastructure/MySQLRepository/ProjectionReturnsRepository';
import PushNotificationDAO from '@infrastructure/MySQLRepository/PushNotificationDAO';
import ReleaseRepository from '@infrastructure/MySQLRepository/ReleaseRepository';
import RepaymentsRepository from '@infrastructure/MySQLRepository/RepaymentsRepository';
import RepaymentsUpdateRepository from '@infrastructure/MySQLRepository/RepaymentsUpdateRepository';
import ToSRepository from '@infrastructure/MySQLRepository/ToSRepository';
import TransactionsHistoryRepository from '@infrastructure/MySQLRepository/TransactionsHistoryRepository';
import UserAppFeedbackDAO from '@infrastructure/MySQLRepository/UserAppFeedbackDAO';
import UserDocumentRepository from '@infrastructure/MySQLRepository/UserDocumentRepository';
import UserMediaRepository from '@infrastructure/MySQLRepository/UserMediaRepository';
import AuthService from '@infrastructure/Service/Auth/AuthService';
import { IAuthService, IAuthServiceId } from '@infrastructure/Service/Auth/IAuthService';
import DwollaService from '@infrastructure/Service/DwollaService';
import ExcelService from '@infrastructure/Service/ExcelService/ExcelService';
import {
  IExcelService,
  IExcelServiceId,
} from '@infrastructure/Service/ExcelService/IExcelService';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import {
  IIdologyService,
  IIdologyServiceId,
} from '@infrastructure/Service/Idology/IIdologyService';
import IdologyService from '@infrastructure/Service/Idology/IdologyService';
import {
  IInvestReadyService,
  IInvestReadyServiceId,
} from '@infrastructure/Service/InvestReadyService/IInvestReadyService';
import InvestReadyService from '@infrastructure/Service/InvestReadyService/InvestReadyService';
import {
  INotificationService,
  INotificationServiceId,
} from '@infrastructure/Service/NotificationService/INotificationService';
import NotificationService from '@infrastructure/Service/NotificationService/NotificationService';
import {
  IPlaidService,
  IPlaidServiceId,
} from '@infrastructure/Service/Plaid/IPlaidService';
import PlaidService from '@infrastructure/Service/Plaid/PlaidService';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';
import RedisAuthService from '@infrastructure/Service/RedisAuth/RedisAuthService';
import {
  IRedisService,
  IRedisServiceId,
} from '@infrastructure/Service/RedisService/IRedisService';
import RedisService from '@infrastructure/Service/RedisService/RedisService';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import SlackService from '@infrastructure/Service/Slack/SlackService';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import StorageService from '@infrastructure/Service/StorageService/StorageService';
import {
  ICreateStripeAccount,
  ICreateStripeAccountId,
} from '@application/User/doKycCheck/Utils/ICreateStripeAccount';
import CreateStripeAccount from '@application/User/doKycCheck/Utils/CreateStripeAccount';
import {
  ITransactionSaleSuccess,
  ITransactionSaleSuccessId,
} from '@application/Webhooks/USAEpay/TransactionSaleSuccess/ITransactionSaleSuccess';
import TransactionSaleSuccess from '@application/Webhooks/USAEpay/TransactionSaleSuccess';
import {
  IUSAEpayEventHandlerFactory,
  IUSAEpayEventHandlerFactoryId,
} from '@application/Webhooks/USAEpay/IUSAEpayEventHandlerFactory';
import USAEpayEventHandlerFactory from '@application/Webhooks/USAEpay/USAEpayEventHandlerFactory';
import {
  IUSAEpayWebhookRepository,
  IUSAEpayWebhookRepositoryId,
} from '@domain/USAEpayWebhooks/IUSAEpayWebhookRepository';
import USAEpayWebhookRepository from '@infrastructure/MySQLRepository/USAEpayWebhookRepository';
import {
  IHandleUSAEpayWebhookUseCase,
  IHandleUSAEpayWebhookUseCaseId,
} from '@application/Webhooks/USAEpay/handleUSAEpayWebhook/IHandleUSAEpayWebhookUseCase';
import HandleUSAEpayWebhookUseCase from '@application/Webhooks/USAEpay/handleUSAEpayWebhook/HandleUSAEpayWebhookUseCase';
import TransactionSaleFailure from '@application/Webhooks/USAEpay/TransactionSaleFailure';
import {
  IAddStripeCardUsecase,
  IAddStripeCardUsecaseId,
} from '@application/InvestorBank/AddStripeCard/IAddStripeCardUsecase';
import AddStripeCardUsecase from '@application/InvestorBank/AddStripeCard/AddStripeCardUsecase';
import {
  IStripeWebhook,
  IStripeWebhookId,
} from '@application/Webhooks/StripeWebhook/IStripeWebhook';
import StripeWebhook from '@application/Webhooks/StripeWebhook/StripeWebhook';
import PaymentIntentSucceeded from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentSucceeded/PaymentIntentSucceeded';
import {
  IPaymentIntentFailure,
  IPaymentIntentFailureId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentFailure/IPaymentIntentFailure';
import PaymentIntentFailure from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentFailure/PaymentIntentFailure';
import {
  IPaymentProcessing,
  IPaymentProcessingId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentProcessing/IPaymentProcessing';
import PaymentProcessing from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentProcessing/PaymentProcessing';
import {
  IPaymentIntentCancelled,
  IPaymentIntentCancelledId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentCancelled/IPaymentIntentCancelled';
import PaymentIntentCancelled from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentCancelled/PaymentIntentCancelled';
import {
  IPaymentIntentCreated,
  IPaymentIntentCreatedId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentCreated/IPaymentIntentCreated';
import PaymentIntentCreated from '@application/Webhooks/StripeWebhook/WebhookHandlers/PaymentIntentCreated/PaymentIntentCreated';
import {
  ICustomerCreated,
  ICustomerCreatedId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/CustomerCreated/ICustomerCreated';
import CustomerCreated from '@application/Webhooks/StripeWebhook/WebhookHandlers/CustomerCreated/CustomerCreated';
import {
  IPayoutPaid,
  IPayoutPaidId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/PayoutPaid/IPayoutPaid';
import PayoutPaid from '@application/Webhooks/StripeWebhook/WebhookHandlers/PayoutPaid/PayoutPaid';
import {
  IPayoutFailed,
  IPayoutFailedId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/PayoutFailed/IPayoutFailed';
import PayoutFailed from '@application/Webhooks/StripeWebhook/WebhookHandlers/PayoutFailed/PayoutFailed';
import {
  INCReturnRequest,
  INCReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/NCReturnRequest/INCReturnRequest';
import CancelNCInvestment from '@application/CampaignFund/FundReturnRequest/Utils/NCReturnRequest/NCReturnRequest';
import { FCReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/FCReturnRequest/FCReturnRequest';
import { StripeReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/StripeReturnRequest/StripeReturnRequest';
import {
  IStripeReturnRequest,
  IStripeReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/StripeReturnRequest/IStripeReturnRequest';
import {
  ISiteBannerConfigurationRepository,
  ISiteBannerConfigurationRepositoryId,
} from '@domain/Core/SiteBannerConfiguration/ISiteBannerConfigurationRepository';
import SiteBannerConfigurationRepository from '@infrastructure/MySQLRepository/SiteBannerConfigurationRepository';
import {
  ISiteBannerConfigurationService,
  ISiteBannerConfigurationServiceId,
} from '@application/SiteBannerConfiguration/ISiteBannerConfigurationService';
import SiteBannerConfigurationService from '@application/SiteBannerConfiguration/SiteBannerConfigurationService';
import {
  IPromotionTextService,
  IPromotionTextServiceId,
} from '@application/PromotionText/IPromotionTextService';
import PromotionTextService from '@application/PromotionText/PromotionTextService';
import {
  IPromotionTextRepository,
  IPromotionTextRepositoryId,
} from '@domain/Core/PromotionText/IPromotionTextRepository';
import PromotionTextRepository from '@infrastructure/MySQLRepository/PromotionTextRepository';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';
import StripeService from '@infrastructure/Service/Stripe/StripeService';
import {
  IFCReturnRequest,
  IFCReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/FCReturnRequest/IFCReturnRequest';
import {
  IFCDwollaTransactionsRepository,
  IFCDwollaTransactionsRepositoryId,
} from '@domain/Core/FCDwollaTransactions/IFCDwollaTransactionsRepository';
import FCDwollaTransactionsRepository from '@infrastructure/MySQLRepository/FCDwollaTransactionsRepository';
import {
  IFCDwollaTransactionsService,
  IFCDwollaTransactionsServiceId,
} from '@application/FCDwollaTransactions/IFCDwollaTransactionsService';
import FCDwollaTransactionsService from '@application/FCDwollaTransactions/FCDwollaTransactionsService';
import {
  IWalletReturnRequest,
  IWalletReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/WalletReturnRequest/IWalletReturnRequest';
import { WalletReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/WalletReturnRequest/WalletReturnRequest';
import {
  IHybridReturnRequest,
  IHybridReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/HybridReturnRequest/IHybridReturnRequest';
import { HybridReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/HybridReturnRequest/HybridReturnRequest';
import {
  IePayCharge,
  IePayChargeId,
} from '@application/CampaignFund/createCampaignFund/Utils/IePayCharge';
import { ePayCharge } from '@application/CampaignFund/createCampaignFund/Utils/ePayCharge';
import {
  ILoanwellRepository,
  ILoanwellRepositoryId,
} from '@domain/Core/Loanwell/ILoanwellRepository';
import LoanwellRepository from '@infrastructure/MySQLRepository/LoanwellRepository';
import {
  ILoanwellSerivce,
  ILoanwellSerivceId,
} from '@application/Loanwell/ILoanwellService';
import LoanwellService from '@application/Loanwell/LoanwellService';
import {
  ILoanwellInfraService,
  ILoanwellInfraServiceId,
} from '@infrastructure/Service/Loanwell/ILoanwellInfraService';
import LoanwellInfraService from '@infrastructure/Service/Loanwell/LoanwellInfraService';
import {
  IChargeSuccess,
  IChargeSuccessId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeSuccess/IChargeSuccess';
import ChargeSuccess from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeSuccess/ChargeSuccess';
import {
  IChargeFailed,
  IChargeFailedId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeFailed/IChargeFailed';
import ChargeFailed from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeFailed/ChargeFailed';
import {
  IOmniBusReport,
  IOmniBusReportId,
} from '@application/Campaign/OmniBusReport/IOmniBusReport';
import OmniBusReport from '@application/Campaign/OmniBusReport/OmniBusReport';
import {
  ICampaignAddressRepository,
  ICampaignAddressRepositoryId,
} from '@domain/Core/CampaignAddress/ICampaignAddressRepository';
import CampaignAddressRepository from '@infrastructure/MySQLRepository/CampaignAddressRepository';
import {
  ICampaignAddressService,
  ICampaignAddressServiceId,
} from '@application/CampaignAddress/ICampaignAddressService';
import CampaignAddressService from '@application/CampaignAddress/CampaignAddressService';
import {
  IDwollaCustodyTransactionsRepository,
  IDwollaCustodyTransactionsRepositoryId,
} from '@domain/Core/DwollaCustodyTransactions/IDwollaCustodyTransactionsRepository';
import DwollaCustodyTransactionsRepository from '@infrastructure/MySQLRepository/DwollaCustodyTransactionsRepository';
import {
  IDwollaCustodyTransactionsService,
  IDwollaCustodyTransactionsServiceId,
} from '@application/DwollaCustodyTransactions/IDwollaCustodyTransactionsService';
import DwollaCustodyTransactionsService from '@application/DwollaCustodyTransactions/DwollaCustodyTransactionsService';
import {
  ITransferFundsToCustodyUseCase,
  ITransferFundsToCustodyUseCaseId,
} from '@application/DwollaCustodyTransactions/TransferFundsToCustody/ITransferFundsToCustodyUsecase';
import TransferFundsToCustodyUsecase from '@application/DwollaCustodyTransactions/TransferFundsToCustody/TransferFundsToCustodyUsecase';
import {
  ITransferFundsToWalletUseCase,
  ITransferFundsToWalletUseCaseId,
} from '@application/DwollaCustodyTransactions/TransferFundsToWallets/ITransferFundsToWalletUsecase';
import TransferFundsToWalletUsecase from '@application/DwollaCustodyTransactions/TransferFundsToWallets/TransferFundsToWalletUsecase';
import DwollaCustodyTransferHistoryRepository from '@infrastructure/MySQLRepository/DwollaCustodyTransferHistoryRepository';
import DwollaCustodyTransferHistoryService from '@application/DwollaCustodyTransferHistory/DwollaCustodyTransferHistoryService';
import {
  IRecaptchaService,
  IRecaptchaServiceId,
} from '@infrastructure/Service/IRecaptchaService';
import RecaptchaService from '@infrastructure/Service/RecaptchaService';
import UpdatePasswordWithCurrentPasswordUseCase from '@application/User/updateUserPassword/UpdatePasswordWithCurrentPasswordUseCase';
import {
  IDwollaCustodyTransferHistoryService,
  IDwollaCustodyTransferHistoryServiceId,
} from '@application/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryService';
import {
  IAsanaService,
  IAsanaServiceId,
} from '@infrastructure/Service/Asana/IAsanaService';
import AsanaService from '@infrastructure/Service/Asana/AsanaService';
import {
  IAsanaWebhook,
  IAsanaWebhookId,
} from '@application/Webhooks/AsanaWebhook/IAsanaWebhook';
import {
  IPlaidWebhook,
  IPlaidWebhookId,
} from '@application/Webhooks/PlaidIDVWebhook/IPlaidWebhook';
import PlaidWebhook from '@application/Webhooks/PlaidIDVWebhook/PlaidWebhook';
import AsanaWebhook from '@application/Webhooks/AsanaWebhook/AsanaWebhook';
import AsanaTicketApproved from '@application/Webhooks/AsanaWebhook/WebhookHandler/Approved/AsanaTicketApproved';
import {
  IAsanaTicketApproved,
  IAsanaTicketApprovedId,
} from '@application/Webhooks/AsanaWebhook/WebhookHandler/Approved/IAsanaTicketApproved';
import {
  INachaService,
  INachaServiceId,
} from '@infrastructure/Service/Nacha/INachaService';
import NachaService from '@infrastructure/Service/Nacha/NachaService';
import { ISftpService, ISftpServiceId } from '@infrastructure/Service/SFTP/ISftpService';
import SftpService from '@infrastructure/Service/SFTP/SftpService';
import { IChargeRefundId } from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeRefund/IChargeRefund';
import { IChargeRefund } from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeRefund/IChargeRefund';
import ChargeRefund from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeRefund/ChargeRefund';
import {
  IChargeRefundFailed,
  IChargeRefundFailedId,
} from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeRefundFailed/IChargeRefundFailed';
import ChargeRefundFailed from '@application/Webhooks/StripeWebhook/WebhookHandlers/ChargeRefundFailed/ChargeRefundFailed';
import {
  IUploadRepayments,
  IUploadRepaymentsId,
} from '@application/Repayments/RepaymentsUploadEventHandler/IUploadRepayments';
import UploadRepayments from '@application/Repayments/RepaymentsUploadEventHandler/UploadRepayments';
import {
  IUploadProjectionReturns,
  IUploadProjectionReturnsId,
} from '@application/ProjectionReturns/UploadProjectionReturnsEventHandler/IUploadProjectionReturns';
import UploadProjectionReturns from '@application/ProjectionReturns/UploadProjectionReturnsEventHandler/UploadProjectionReturns';
import { IePay, IePayId } from '@application/CampaignFund/EPay/IePay';
import { EPayService } from '@application/CampaignFund/EPay/EPayService';

import {
  ITagCategoryRepository,
  ITagCategoryRepositoryId,
} from '@domain/Core/TagCategory/ITagCategoryRepository';
import TagCategoryRepository from '@infrastructure/MySQLRepository/TagCategoryRepository';
import {
  IGoogleMapsService,
  IGoogleMapsServiceId,
} from '@infrastructure/Service/googleMapsService/IGoogleMapsService';

import GoogleMapsService from '@infrastructure/Service/googleMapsService/googleMapsService';
import {
  IUserTagPreferenceRepository,
  IUserTagPreferenceRepositoryId,
} from '@domain/Core/UserPreferences/IUserTagPreferenceRepository';
import UserTagPreferenceRepository from '@infrastructure/MySQLRepository/UserTagPreferenceRepository';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container
  .bind<ICampaignFundRepository>(ICampaignFundRepositoryId)
  .to(CampaignFundRespository);
container.bind<IContactRepository>(IContactRepositoryId).to(ContactRespository);
container.bind<ICampaignQARepository>(ICampaignQARepositoryId).to(CampaignQARespository);
container.bind<IUserRepository>(IUserRepositoryId).to(UserRepository);
container.bind<IProfilePicDao>(IProfilePicDaoId).to(ProfilePicDAO);
container.bind<IOwnerDao>(IOwnerDaoId).to(OwnerDAO);
container.bind<IInvestorDao>(IInvestorDaoId).to(InvestorDAO);
container.bind<IUserEventDao>(IUserEventDaoId).to(UserEventDAO);
container.bind<IAdminUserRepository>(IAdminUserRepositoryId).to(AdminUserRepository);
container.bind<IAdminRoleRepository>(IAdminRoleRepositoryId).to(AdminRoleRepository);
container.bind<ITagRepository>(ITagRepositoryId).to(TagRepository);
container
  .bind<ICapitalRequestRepository>(ICapitalRequestRepositoryId)
  .to(CapitalRequestRepository);
container
  .bind<ICampaignTagRepository>(ICampaignTagRepositoryId)
  .to(CampaignTagRepository);
container
  .bind<IUncaughtExceptionRepository>(IUncaughtExceptionRepositoryId)
  .to(UncaughtExceptionRepository);
container
  .bind<ICampaignMediaRepository>(ICampaignMediaRepositoryId)
  .to(CampaignMediaRepository);
container.bind<ICampaignTagService>(ICampaignTagServiceId).to(CampaignTagService);
container
  .bind<ICampaignInfoRepository>(ICampaignInfoRepositoryId)
  .to(CampaignInfoRepository);
container
  .bind<IUncaughtExceptionService>(IUncaughtExceptionServiceId)
  .to(UncaughtExceptionService);
container
  .bind<ICampaignDocumentRepository>(ICampaignDocumentRepositoryId)
  .to(CampaignDocumentRepository);
container
  .bind<ICampaignDocumentService>(ICampaignDocumentServiceId)
  .to(CampaignDocumentService);
container.bind<ICampaignQAService>(ICampaignQAServiceId).to(CampaignQAService);
container
  .bind<ICampaignQAReportRepository>(ICampaignQAReportRepositoryId)
  .to(CampaignQAReportRepository);
container
  .bind<ICampaignQAReportService>(ICampaignQAReportServiceId)
  .to(CampaignQAReportService);
container
  .bind<ICampaignRiskRepository>(ICampaignRiskRepositoryId)
  .to(CampaignRiskRepository);
container.bind<ICampaignRiskService>(ICampaignRiskServiceId).to(CampaignRiskService);

container
  .bind<ICampaignOwnerStoryRepository>(ICampaignOwnerStoryRepositoryId)
  .to(CampaignOwnerStoryRepository);
container
  .bind<ICampaignOwnerStoryService>(ICampaignOwnerStoryServiceId)
  .to(CampaignOwnerStoryService);
container.bind<ICreateIssueUseCase>(ICreateIssueUseCaseId).to(CreateIssueUseCase);
container
  .bind<IGetAllCampaignsUseCase>(IGetAllCampaignsUseCaseId)
  .to(GetAllCampaignsUseCase);
container.bind<IFindCampaignUseCase>(IFindCampaignUseCaseId).to(FindCampaignUseCase);
container
  .bind<IGetOwnerCampaignUseCase>(IGetOwnerCampaignUseCaseId)
  .to(GetOwnerCampaignUseCase);
container.bind<ICampaignNewsMediaDAO>(ICampaignNewsMediaDaoId).to(CampaignNewsMediaDAO);
container.bind<ICampaignNewsService>(ICampaignNewsServiceId).to(CampaignNewsService);
container
  .bind<ICampaignNewsRepository>(ICampaignNewsRepositoryId)
  .to(CampaignNewsRepository);
container
  .bind<ICampaignNewsReportRepository>(ICampaignNewsReportRepositoryId)
  .to(CampaignNewsReportRepository);
container
  .bind<ICampaignNewsReportService>(ICampaignNewsReportServiceId)
  .to(CampaignNewsReportService);

container
  .bind<IFavoriteCampaignRepository>(IFavoriteCampaignRepositoryId)
  .to(FavoriteCampaignRepository);
container
  .bind<ICampaignFavoriteService>(ICampaignFavoriteServiceId)
  .to(CampaignFavoriteService);
container.bind<IChargeRepository>(IChargeRepositoryId).to(ChargeRepository);
container.bind<ICampaignFundService>(ICampaignFundServiceId).to(CampaignFundService);
container
  .bind<ICreateCampaignUseCase>(ICreateCampaignUseCaseId)
  .to(CreateCampaignUseCase);
container
  .bind<IFindCampaignInfoUseCase>(IFindCampaignInfoUseCaseId)
  .to(FindCampaignInfoUseCase);
container.bind<ICampaignService>(ICampaignServiceId).to(CampaignService);
container
  .bind<ICreateCampaignFundUseCase>(ICreateCampaignFundUseCaseId)
  .to(CreateCampaignFundUseCase);

container.bind<IOptInOfEmailUseCase>(IOptInOfEmailUseCaseId).to(OptInOfEmailUseCase);
container.bind<IOptOutOfEmailUseCase>(IOptOutOfEmailUseCaseId).to(OptOutOfEmailUseCase);
container.bind<IToSRepository>(IToSRepositoryId).to(ToSRepository);
container.bind<IToSService>(IToSServiceId).to(ToSService);
container.bind<IGetUserToSUseCase>(IGetUserToSUseCaseId).to(GetUserToS);
container
  .bind<ICampaignOfferingChangeService>(ICampaignOfferingChangeServiceId)
  .to(CampaignOfferingChangeService);
container
  .bind<IDeactivateUserUseCase>(IDeactivateUserUseCaseId)
  .to(DeactivateUserUseCase);
container.bind<IUserService>(IUserServiceId).to(UserService);
container.bind<IInvitationRepository>(IInvitationRepositoryId).to(InvitationRepository);
container.bind<IInvitationService>(IInvitationServiceId).to(InvitationService);

container
  .bind<IInvestorAccreditationDAO>(IInvestorAccreditationDAOId)
  .to(InvestorAccreditationDAO);

container
  .bind<IAddInvestorBankUseCase>(IAddInvestorBankUseCaseId)
  .to(AddInvestorBankUseCase);
container
  .bind<IDeleteInvestorPaymentOptionUseCase>(IDeleteInvestorPaymentOptionUseCaseId)
  .to(DeleteInvestorPaymentOptionUseCase);
container
  .bind<IGetInvestorPaymentOptionsUseCase>(IGetInvestorPaymentOptionsUseCaseId)
  .to(GetInvestorPaymentOptionsUseCase);
container
  .bind<IInvestorPaymentOptionsRepository>(IInvestorPaymentOptionsRepositoryId)
  .to(InvestorPaymentOptionsRepository);
container.bind<IInvestorCardDAO>(IInvestorCardDAOId).to(InvestorCardDAO);
container.bind<IInvestorBankDAO>(IInvestorBankDAOId).to(InvestorBankDAO);
container.bind<IUserMediaRepository>(IUserMediaRepositoryId).to(UserMediaRepository);
container.bind<IUserMediaService>(IUserMediaServiceId).to(UserMediaService);
container
  .bind<IInitiateAccreditationUseCase>(IInitiateAccreditationUseCaseId)
  .to(InitiateAccreditationUseCase);
container.bind<IUpdateUserUseCase>(IUpdateUserUseCaseId).to(UpdateUserUseCase);
container
  .bind<ISendGlobalNotificationUseCase>(ISendGlobalNotificationUseCaseId)
  .to(SendGlobalNotificationUseCase);
container
  .bind<ITotalInvestedAmountUseCase>(ITotalInvestedAmountUseCaseId)
  .to(TotalInvestedAmountUseCase);
container.bind<IPlaidService>(IPlaidServiceId).to(PlaidService);
container.bind<IAuthService>(IAuthServiceId).to(AuthService);
container
  .bind<IUpdateUserPasswordUseCase>(IUpdateUserPasswordUseCaseId)
  .to(UpdateUserPasswordUseCase);
container
  .bind<IUpdatePasswordWithCurrentPasswordUseCase>(
    IUpdatePasswordWithCurrentPasswordUseCaseId,
  )
  .to(UpdatePasswordWithCurrentPasswordUseCase);
container
  .bind<ISendEmailVerificationLinkUseCase>(ISendEmailVerificationLinkUseCaseId)
  .to(SendEmailVerificationLinkUseCase);
container.bind<IUserAppFeedbackDAO>(IUserAppFeedbackDAOId).to(UserAppFeedbackDAO);
container.bind<IIssueRepository>(IIssueRepositoryId).to(IssueRepository);
container.bind<ICampaignRepository>(ICampaignRepositoryId).to(CampaignRepository);
container
  .bind<IReactivateUserUseCase>(IReactivateUserUseCaseId)
  .to(ReactivateUserUseCase);
container
  .bind<IReactivateUserAuthUseCase>(IReactivateUserAuthUseCaseId)
  .to(ReactivateUserAuthUseCase);
container
  .bind<IUserDocumentRepository>(IUserDocumentRepositoryId)
  .to(UserDocumentRepository);
container.bind<IUserDocumentService>(IUserDocumentServiceId).to(UserDocumentService);
container.bind<IPushNotificationDAO>(IPushNotificationDAOId).to(PushNotificationDAO);
container.bind<INotificationService>(INotificationServiceId).to(NotificationService);
container
  .bind<ISendBusinessUpdateNotificationsUseCase>(
    ISendBusinessUpdateNotificationsUseCaseId,
  )
  .to(SendBusinessUpdateNotificationsUseCase);
container
  .bind<ISendUserNotifyAddPersonalDetailUseCase>(
    ISendUserNotifyAddPersonalDetailUseCaseId,
  )
  .to(SendUserNotifyAddPersonalDetailUseCase);
container
  .bind<ISendNewCampaignNotificationsUseCase>(ISendNewCampaignNotificationsUseCaseId)
  .to(SendNewCampaignNotificationsUseCase);
container
  .bind<ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase>(
    ISendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCaseId,
  )
  .to(SendLikedCampaignExpirationNotifyBeforeThirtyDaysUseCase);
container
  .bind<ISendLikedCampaignExpirationNotifyBeforeOneDayUseCase>(
    ISendLikedCampaignExpirationNotifyBeforeOneDayUseCaseId,
  )
  .to(SendLikedCampaignExpirationNotifyBeforeOneDayUseCase);
container
  .bind<IPushNotificationService>(IPushNotificationServiceId)
  .to(PushNotificationService);
container.bind<IReleaseRepository>(IReleaseRepositoryId).to(ReleaseRepository);
container.bind<IPushUpdateService>(IPushUpdateServiceId).to(PushUpdateService);
container
  .bind<ICampaignNotesRepository>(ICampaignNotesRepositoryId)
  .to(CampaignNotesRepository);
container.bind<ICampaignNotesService>(ICampaignNotesServiceId).to(CampaignNotesService);
container
  .bind<IIssuerDocumentService>(IIssuerDocumentServiceId)
  .to(IssuerDocumentService);
container.bind<IUserEventService>(IUserEventServiceId).to(UserEventService);
container.bind<IIssuerBankRepository>(IIssuerBankRepositoryId).to(IssuerBankRepository);
container.bind<IIssuerBankService>(IIssuerBankServiceId).to(IssuerBankService);
container.bind<ICampaignPLRepository>(ICampaignPLRepositoryId).to(CampaignPLRepository);
container.bind<ICampaignPLService>(ICampaignPLServiceId).to(CampaignPLService);
container.bind<INAICRepository>(INAICRepositoryId).to(NAICRepository);
container.bind<INAICService>(INAICServiceId).to(NAICService);
container.bind<IIssuerRepository>(IIssuerRepositoryId).to(IssuerRespository);
container
  .bind<IIssuerDocumentRepository>(IIssuerDocumentRepositoryId)
  .to(IssuerDocumentRepository);
container.bind<IIssuerService>(IIssuerServiceId).to(IssuerService);
container
  .bind<ICampaignEscrowBankService>(ICampaignEscrowBankServiceId)
  .to(CampaignEscrowBankService);
container
  .bind<ICampaignEscrowBankRepository>(ICampaignEscrowBankRepositoryId)
  .to(CampaignEscrowBankRepository);
container
  .bind<INorthCapitalWebhookRepository>(INorthCapitalWebhookRepositoryId)
  .to(NorthCapitalWebhookRepository);
container
  .bind<IHandleNorthCapitalWebhookUseCase>(IHandleNorthCapitalWebhookUseCaseId)
  .to(HandleNorthCapitalWebhookUseCase);
container
  .bind<ICampaignRoughBudgetRepository>(ICampaignRoughBudgetRepositoryId)
  .to(CampaignRoughBudgetRepository);
container
  .bind<ICampaignRoughBudgetService>(ICampaignRoughBudgetServiceId)
  .to(CampaignRoughBudgetService);
container.bind<IIdologyService>(IIdologyServiceId).to(IdologyService);
container.bind<IIdologyTimestampDAO>(IIdologyTimestampDAOId).to(IdologyTimestampDAO);
container.bind<IPlaidIDVUseCase>(IPlaidIDVUseCaseId).to(PlaidIDVUseCase);
container
  .bind<IPlaidLinkTokenUseCase>(IPlaidLinkTokenUseCaseId)
  .to(PlaidLinkTokenUseCase);
container
  .bind<IDisablePortfolioVisitedPromptUseCase>(IDisablePortfolioVisitedPromptUseCaseId)
  .to(DisablePortfolioVisitedPromptUseCase);
container
  .bind<IDisableIdVerifiedPromptUseCase>(IDisableIdVerifiedPromptUseCaseId)
  .to(DisabledIdVerifiedPromptUseCase);
container.bind<IDokycCHeckUseCase>(IDoKycCheckUseCaseId).to(DoKycCheckUseCase);
container.bind<IExcelService>(IExcelServiceId).to(ExcelService);
container.bind<IInvestReadyService>(IInvestReadyServiceId).to(InvestReadyService);
container.bind<IRedisService>(IRedisServiceId).to(RedisService);
container.bind<ISlackService>(ISlackServiceId).to(SlackService);
container.bind<IStorageService>(IStorageServiceId).to(StorageService);
container.bind<IIssuerOwnerDAO>(IIssuerOwnerDAOId).to(IssuerOwnerDAO);
container.bind<IRedisAuthService>(IRedisAuthServiceId).to(RedisAuthService);
container.bind<IDwollaWebhookDAO>(IDwollaWebhookDAOId).to(DwollaWebhookDAO);
container.bind<IDwollaService>(IDwollaServiceId).to(DwollaService);
container.bind<IAdminDwollaService>(IAdminDwollaServiceId).to(AdminDwollaService);
container.bind<IWebhookService>(IWebhookServiceId).to(WebhookService);
container.bind<IPlaidWebhook>(IPlaidWebhookId).to(PlaidWebhook);
container
  .bind<IInMemoryAsyncEventBus>(IInMemoryAsyncEventBusId)
  .to(InMemoryAsyncEventBus);
container
  .bind<ICampaignOfferingChangeRepository>(ICampaignOfferingChangeRepositoryId)
  .to(CampaignOfferingChangeRepository);
container.bind<IEmployeeRepository>(IEmployeeRepositoryId).to(EmployeeRepository);
container.bind<IEmployeeService>(IEmployeeServiceId).to(EmployeeService);
container
  .bind<ICheckEmailAvaliabilityUseCase>(ICheckEmailAvaliabilityUseCaseId)
  .to(CheckEmailAvailabilityUseCase);
container
  .bind<ISubmitFeedbackUseCase>(ISubmitFeedbackUseCaseId)
  .to(SubmitFeedbackUseCase);
container
  .bind<IGetFavoriteCampaignUseCase>(IGetFavoriteCampaignUseCaseId)
  .to(GetFavoriteCampaignUseCase);
container
  .bind<IGetUsersEmailByCategoryUseCase>(IGetUsersEmailByCategoryUseCaseId)
  .to(getUsersEmailByCategoryUseCase);
container
  .bind<ISubmitContactRequestUseCase>(ISubmitContactRequestUseCaseId)
  .to(SubmitContactRequestUseCase);
container.bind<ISummaryUseCase>(ISummaryUseCaseId).to(SummaryUseCase);
container
  .bind<IUpdateUserProfilePicture>(IUpdateUserProfilePictureId)
  .to(UpdateUserProfilePicture);
container.bind<ICreateIssuerUseCase>(ICreateIssuerUseCaseId).to(CreateIssuerUseCase);
container.bind<IUserAppFeedback>(IUserAppFeedbackService).to(UserAppFeedbackService);
container
  .bind<INorthCapitalEventHandlerFactory>(INorthCapitalEventHandlerFactoryId)
  .to(NorthCapitalEventHandlerFactory);
container
  .bind<ICreateAccountWebhookHandler>(ICreateAccountWebhookHandlerId)
  .to(CreateAccountWebhookHandler);
container
  .bind<ICreatePartyWebhookHandler>(ICreatePartyWebhookHandlerId)
  .to(CreatePartyWebhookHandler);
container
  .bind<ICreateTradeWebhookHandler>(ICreateTradeWebhookHandlerId)
  .to(CreateTradeWebhookHandler);
container
  .bind<IUpdateAiVerificationWebhookHandler>(IUpdateAiVerificationWebhookHandlerId)
  .to(UpdateAiVerificationWebhookHandler);
container
  .bind<IUpdateBankFundMoveStatusWebhookHandler>(
    IUpdateBankFundMoveStatusWebhookHandlerId,
  )
  .to(UpdateBankFundMoveStatusWebhookHandler);
container
  .bind<IUpdateCCFundMoveStatusWebhookHandler>(IUpdateCCFundMoveStatusWebhookHandlerId)
  .to(UpdateCCFundMoveStatusWebhookHandler);
container
  .bind<IUpdateTradeStatusWebhookHandler>(IUpdateTradeStatusWebhookHandlerId)
  .to(UpdateTradeStatusWebhookHandler);
container
  .bind<IGlobalHoneycombConfigurationRepository>(
    IGlobalHoneycombConfigurationRepositoryId,
  )
  .to(GlobalHoneycombConfigurationRepository);
container
  .bind<IGlobalHoneycombConfigurationService>(IGlobalHoneycombConfigurationServiceId)
  .to(GlobalHoneycombConfigurationService);
container
  .bind<ICampaignHoneycombChargeFeeRepository>(ICampaignHoneycombChargeFeeId)
  .to(CampaignHoneycombChargeFeeRepository);
container.bind<IVerifySsnUseCase>(IVerifySsnUseCaseId).to(VerifySsnUseCase);
container
  .bind<IUpdateUserNewPasswordUseCase>(IUpdateUserNewPasswordUseCaseId)
  .to(UpdateUserNewPasswordUseCase);
container.bind<IUploadUserIdUseCase>(IUploadUserIdUseCaseId).to(UploadUserIdUseCase);
container
  .bind<IFundReturnRequestUseCase>(IFundReturnRequestUseCaseId)
  .to(FundReturnRequestUseCase);
container
  .bind<ISendSubscriptionDocumentsUseCase>(ISendSubscriptionDocumentsUseCaseId)
  .to(SendSubscriptionDocumentsUseCase);
container.bind<IRepaymentsRepository>(IRepaymentsRepositoryId).to(RepaymentsRepository);
container.bind<IRepaymentsService>(IRepaymentsServiceId).to(RepaymentsService);
container
  .bind<IInvestorPaymentsRepository>(IInvestorPaymentsRepositoryId)
  .to(InvestorPaymentsRepository);
container
  .bind<IInvestorPaymentsService>(IInvestorPaymentsServiceId)
  .to(InvestorPaymentsService);
container
  .bind<IProjectionReturnsRepository>(IProjectionReturnsRepositoryId)
  .to(ProjectionReturnsRepository);
container
  .bind<IProjectionReturnsService>(IProjectionReturnsServiceId)
  .to(ProjectionReturnsService);
container
  .bind<IRepaymentsUpdateRepository>(IRepaymentsUpdateRepositoryId)
  .to(RepaymentsUpdateRepository);
container
  .bind<IEntityIntermediaryRepository>(IEntityIntermediaryRepositoryId)
  .to(EntityIntermediaryRepository);

container
  .bind<IEntityAccreditationRepository>(IEntityAccreditationRepositoryId)
  .to(EntityAccreditationRepository);

container
  .bind<IEntityCampaignFundRepository>(IEntityCampaignFundRepositoryId)
  .to(EntityCampaignFundRepository);
container.bind<ICampaignNPAUseCase>(ICampaignNPAUseCaseId).to(CampaignNPAUseCase);
container
  .bind<IHoneycombDwollaConsentRepository>(IHoneycombDwollaConsentRepositoryId)
  .to(HoneycombDwollaConsentRepository);

container
  .bind<IHoneycombDwollaConsentService>(IHoneycombDwollaConsentServiceId)
  .to(HoneycombDwollaConsentService);

container
  .bind<IHoneycombDwollaCustomerRepository>(IHoneycombDwollaCustomerRepositoryId)
  .to(HoneycombDwollaCustomerRepository);

container
  .bind<IHoneycombDwollaBeneficialOwnerRepository>(
    IHoneycombDwollaBeneficialOwnerRepositoryId,
  )
  .to(HoneycombDwollaBeneficialOwnerRepository);

container
  .bind<IHoneycombDwollaBeneficialOwnerService>(IHoneycombDwollaBeneficialOwnerServiceId)
  .to(HoneycombDwollaBeneficialOwnerService);

container
  .bind<IHoneycombDwollaOnDemandAuthorization>(IHoneycombDwollaOnDemandAuthorizationId)
  .to(HoneycombDwollaOnDemandAuthorization);

container
  .bind<IDwollaFundingSourceVerificationRepository>(
    IDwollaFundingSourceVerificationRepositoryId,
  )
  .to(DwollaFundingSourceVerificationRepository);
container
  .bind<IDwollaFundingSourceVerificationService>(
    IDwollaFundingSourceVerificationServiceId,
  )
  .to(DwollaFundingSourceVerificationService);
container
  .bind<IDwollaBusinessClassificationService>(IDwollaBusinessClassificationServiceId)
  .to(DwollaBusinessClassificationService);
container
  .bind<IHoneycombDwollaCustomerService>(IHoneycombDwollaCustomerServiceId)
  .to(HoneycombDwollaCustomerService);
container
  .bind<IDwollaPreTransactionsRepository>(IDwollaPreTransactionsRepositoryId)
  .to(DwollaPreTransactionsRepository);
container
  .bind<IDwollaPreTransactionsService>(IDwollaPreTransactionsServiceId)
  .to(DwollaPreTransactionsService);
container
  .bind<ICreateDwollaPreTransactionsUsecase>(ICreateDwollaPreTransactionsUsecaseId)
  .to(CreateDwollaPreTransactionsUsecase);
container
  .bind<IPreTransactionService>(IPreTransactionServiceId)
  .to(PreTransactionService);
container
  .bind<IReEvaluatePreTransactionsUseCase>(IReEvaluatePreTransactionsUseCaseId)
  .to(ReEvaluatePreTransactionsUseCase);
container
  .bind<IDwollaPreBankTransactionsRepository>(IDwollaPreBankTransactionsRepositoryId)
  .to(DwollaPreBankTransactionsRepository);
container
  .bind<IDwollaPreBankTransactionsService>(IDwollaPreBankTransactionsServiceId)
  .to(DwollaPreBankTransactionsService);
container
  .bind<ICreateDwollaPreBankTransactionsUsecase>(
    ICreateDwollaPreBankTransactionsUsecaseId,
  )
  .to(CreateDwollaPreBankTransactionsUseCase);
container
  .bind<IDwollaToBankTransactionsRepository>(IDwollaToBankTransactionsRepositoryId)
  .to(DwollaToBankTransactionsRepository);
container
  .bind<IDwollaToBankTransactionsService>(IDwollaToBankTransactionsServiceId)
  .to(DwollaToBankTransactionsService);
container
  .bind<IDwollaPostTransactionsRepository>(IDwollaPostTransactionsRepositoryId)
  .to(DwollaPostTransactionsRepository);
container
  .bind<IDwollaPostTransactionsService>(IDwollaPostTransactionsServiceId)
  .to(DwollaPostTransactionsService);
container
  .bind<ICreatePostTransactionsUseCase>(ICreatePostTransactionsUseCaseId)
  .to(CreatePostTransactionsUseCase);
container
  .bind<IReEvaluatePreBankTransactionsUseCase>(IReEvaluatePreBankTransactionsUseCaseId)
  .to(ReEvaluatePreBankTransactions);
container
  .bind<IDwollaCustodyTransferHistoryRepository>(
    IDwollaCustodyTransferHistoryRepositoryId,
  )
  .to(DwollaCustodyTransferHistoryRepository);
container
  .bind<IDwollaPostBankTransactionsRepository>(IDwollaPostBankTransactionsRepositoryId)
  .to(DwollaPostBankTransactionsRepository);
container
  .bind<IDwollaPostBankTransactionsService>(IDwollaPostBankTransactionsServiceId)
  .to(DwollaPostBankTransactionsService);
container
  .bind<ICreatePostBankTransactionsUseCase>(ICreatePostBankTransactionsUseCaseId)
  .to(CreatePostBankTransactionsUseCase);
container
  .bind<ITransactionsHistoryRepository>(ITransactionsHistoryRepositoryId)
  .to(TransactionsHistoryRepository);
container
  .bind<IAddPersonalVerifiedCustomer>(IAddPersonalVerifiedCustomerId)
  .to(AddPersonalVerifiedCustomer);
container
  .bind<ICampaignPrincipleForgivenRepository>(ICampaignPrincipleForgivenRepositoryId)
  .to(CampaignPrincipleForgivenRepository);
container
  .bind<ICampaignPrincipleForgivenService>(ICampaignPrincipleForgivenServiceId)
  .to(CampaignPrincipleForgivenService);
container
  .bind<IDeleteProjectionReturns>(IDeleteProjectionReturnsId)
  .to(DeleteProjectionReturns);
container
  .bind<IHybridTransactionRepoistory>(IHybridTransactionRepoistoryId)
  .to(HybridTransactionRepository);
container.bind<IBankCharge>(IBankChargeId).to(BankCharge);
container.bind<ICampaignEvents>(ICampaignEventsId).to(CampaignEvents);
container
  .bind<ICampaignMeetsCriteria>(ICampaignMeetsCriteriaId)
  .to(CampaignMeetsCriteria);
container
  .bind<IFetchEntitiesFromDatabase>(IFetchEntitiesFromDatabaseId)
  .to(FetchEntitiesFromDatabase);
container
  .bind<IInvestorMeetsCriteria>(IInvestorMeetsCriteriaId)
  .to(InvestorMeetsCriteria);
container.bind<IWalletCharge>(IWalletChargeId).to(WalletCharge);
container
  .bind<INorthCapitalDocumentRepository>(INorthCapitalDocumentRepositoryId)
  .to(NorthCapitalDocumentRepository);
container.bind<IExportUserDataUseCase>(IExportUserDataUseCaseId).to(ExportUserUseCase);
container.bind<IExportDataRepository>(IExportDataRepositoryId).to(ExportDataRepository);
container.bind<IExportDataService>(IExportDataServiceId).to(ExportDataService);
container
  .bind<IExportInvestorRateOfReturnUseCase>(IExportInvestorRateOfReturnUseCaseId)
  .to(ExportInvestorRateOfReturnUseCase);
container
  .bind<ICampaignNotificationRepository>(ICampaignNotificationRepositoryId)
  .to(CampaignNotificationRepository);
container
  .bind<ICampaignNotificationService>(ICampaignNotificationServiceId)
  .to(CampaignNotificationService);
container
  .bind<IRepaymentExportDataUseCase>(IRepaymentExportDataUseCaseId)
  .to(RepaymentExportDataUseCase);
container
  .bind<IExportInvestorProjectionReturnsUseCase>(
    IExportInvestorProjectionReturnsUseCaseId,
  )
  .to(ExportInvestorProjectionReturnsUseCase);
container
  .bind<INorthCapitalDocumentService>(INorthCapitalDocumentServiceId)
  .to(NorthCapitalDocumentService);
container
  .bind<IUserTransactionHistoryUsecase>(IUserTransactionHistoryUsecaseId)
  .to(UserTransactionHistoryHistoryUsecase);
container
  .bind<ILinkCreditCardService>(ILinkCreditCardServiceId)
  .to(LinkCreditCardService);
container.bind<ICardCharge>(ICardChargeId).to(CardCharge);
container
  .bind<IFundSlackNotification>(IFundSlackNotificationId)
  .to(FundSlackNotification);
container.bind<ICampaignFundNPA>(ICampaignFundNPAId).to(CampaignFundNPA);
container
  .bind<ICheckTransactionLimit>(ICheckTransactionLimitId)
  .to(CheckTransactionLimit);
container
  .bind<IUploadVoidedCheckUseCase>(IUploadVoidedCheckUseCaseId)
  .to(UploadVoidedCheckUseCase);
container
  .bind<IEmployeeLogRepository>(IEmployeeLogRepositoryId)
  .to(EmployeeLogRepository);
container.bind<IEmployeeLogService>(IEmployeeLogServiceId).to(EmployeeLogService);
container.bind<IHybridCharge>(IHybridChargeId).to(HybridCharge);
container
  .bind<IExportEducationalDataUsecase>(IExportEducationalDataUsecaseId)
  .to(ExportEducationalDataUsecase);
container.bind<ICreateNCAccount>(ICreateNCAccountId).to(CreateNCAccount);
container.bind<ICreateUSAEPayAccount>(ICreateUSAEPayAccountId).to(CreateUSAEPayAccount);
container.bind<ICreateStripeAccount>(ICreateStripeAccountId).to(CreateStripeAccount);
container
  .bind<ITransactionSaleSuccess>(ITransactionSaleSuccessId)
  .to(TransactionSaleSuccess);
container
  .bind<IUSAEpayEventHandlerFactory>(IUSAEpayEventHandlerFactoryId)
  .to(USAEpayEventHandlerFactory);
container
  .bind<IUSAEpayWebhookRepository>(IUSAEpayWebhookRepositoryId)
  .to(USAEpayWebhookRepository);
container
  .bind<IHandleUSAEpayWebhookUseCase>(IHandleUSAEpayWebhookUseCaseId)
  .to(HandleUSAEpayWebhookUseCase);
container
  .bind<ITransactionSaleFailure>(ITransactionSaleFailureId)
  .to(TransactionSaleFailure);

container.bind<IAddStripeCardUsecase>(IAddStripeCardUsecaseId).to(AddStripeCardUsecase);
container.bind<IStripeWebhook>(IStripeWebhookId).to(StripeWebhook);
container
  .bind<IPaymentIntentSucceeded>(IPaymentIntentSucceededId)
  .to(PaymentIntentSucceeded);
container.bind<IPaymentIntentFailure>(IPaymentIntentFailureId).to(PaymentIntentFailure);
container.bind<IPaymentProcessing>(IPaymentProcessingId).to(PaymentProcessing);
container
  .bind<IPaymentIntentCancelled>(IPaymentIntentCancelledId)
  .to(PaymentIntentCancelled);
container.bind<IPaymentIntentCreated>(IPaymentIntentCreatedId).to(PaymentIntentCreated);
container.bind<ICustomerCreated>(ICustomerCreatedId).to(CustomerCreated);
container.bind<IPayoutPaid>(IPayoutPaidId).to(PayoutPaid);
container.bind<IPayoutFailed>(IPayoutFailedId).to(PayoutFailed);
container.bind<INCReturnRequest>(INCReturnRequestId).to(CancelNCInvestment);
container.bind<IFCReturnRequest>(IFCReturnRequestId).to(FCReturnRequest);
container.bind<IStripeReturnRequest>(IStripeReturnRequestId).to(StripeReturnRequest);
container
  .bind<ISiteBannerConfigurationRepository>(ISiteBannerConfigurationRepositoryId)
  .to(SiteBannerConfigurationRepository);
container
  .bind<ISiteBannerConfigurationService>(ISiteBannerConfigurationServiceId)
  .to(SiteBannerConfigurationService);
container.bind<IPromotionTextService>(IPromotionTextServiceId).to(PromotionTextService);
container
  .bind<IPromotionTextRepository>(IPromotionTextRepositoryId)
  .to(PromotionTextRepository);
container
  .bind<IDwollaCustodyTransferHistoryService>(IDwollaCustodyTransferHistoryServiceId)
  .to(DwollaCustodyTransferHistoryService);
container.bind<IStripeService>(IStripeServiceId).to(StripeService);
container
  .bind<IFCDwollaTransactionsRepository>(IFCDwollaTransactionsRepositoryId)
  .to(FCDwollaTransactionsRepository);
container
  .bind<IFCDwollaTransactionsService>(IFCDwollaTransactionsServiceId)
  .to(FCDwollaTransactionsService);
container.bind<IWalletReturnRequest>(IWalletReturnRequestId).to(WalletReturnRequest);
container.bind<IHybridReturnRequest>(IHybridReturnRequestId).to(HybridReturnRequest);
container.bind<IePayCharge>(IePayChargeId).to(ePayCharge);
container.bind<ILoanwellRepository>(ILoanwellRepositoryId).to(LoanwellRepository);
container.bind<ILoanwellSerivce>(ILoanwellSerivceId).to(LoanwellService);
container.bind<ILoanwellInfraService>(ILoanwellInfraServiceId).to(LoanwellInfraService);
container.bind<IAsanaService>(IAsanaServiceId).to(AsanaService);
container.bind<IAsanaWebhook>(IAsanaWebhookId).to(AsanaWebhook);
container.bind<IAsanaTicketApproved>(IAsanaTicketApprovedId).to(AsanaTicketApproved);
container.bind<IChargeSuccess>(IChargeSuccessId).to(ChargeSuccess);
container.bind<IChargeFailed>(IChargeFailedId).to(ChargeFailed);
container.bind<IChargeRefund>(IChargeRefundId).to(ChargeRefund);
container.bind<IOmniBusReport>(IOmniBusReportId).to(OmniBusReport);
container
  .bind<ICampaignAddressRepository>(ICampaignAddressRepositoryId)
  .to(CampaignAddressRepository);
container
  .bind<ICampaignAddressService>(ICampaignAddressServiceId)
  .to(CampaignAddressService);
container
  .bind<IDwollaCustodyTransactionsRepository>(IDwollaCustodyTransactionsRepositoryId)
  .to(DwollaCustodyTransactionsRepository);
container
  .bind<IDwollaCustodyTransactionsService>(IDwollaCustodyTransactionsServiceId)
  .to(DwollaCustodyTransactionsService);
container
  .bind<ITransferFundsToCustodyUseCase>(ITransferFundsToCustodyUseCaseId)
  .to(TransferFundsToCustodyUsecase);
container
  .bind<ITransferFundsToWalletUseCase>(ITransferFundsToWalletUseCaseId)
  .to(TransferFundsToWalletUsecase);
container.bind<IRecaptchaService>(IRecaptchaServiceId).to(RecaptchaService);
container.bind<INachaService>(INachaServiceId).to(NachaService);
container.bind<ISftpService>(ISftpServiceId).to(SftpService);
container.bind<IChargeRefundFailed>(IChargeRefundFailedId).to(ChargeRefundFailed);
container.bind<IUploadRepayments>(IUploadRepaymentsId).to(UploadRepayments);
container.bind<IePay>(IePayId).to(EPayService);
container
  .bind<ITagCategoryRepository>(ITagCategoryRepositoryId)
  .to(TagCategoryRepository);
container
  .bind<IUploadProjectionReturns>(IUploadProjectionReturnsId)
  .to(UploadProjectionReturns);
container.bind<IGoogleMapsService>(IGoogleMapsServiceId).to(GoogleMapsService);
container
  .bind<IUserTagPreferenceRepository>(IUserTagPreferenceRepositoryId)
  .to(UserTagPreferenceRepository);

// @ts-ignore
export default container;
