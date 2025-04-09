import { User } from "./user.interface";
export { }

declare global {
  interface Window {
    whiteWarningIcon: string;
    grayWarningIcon: string;
    stockflowLogo: string;
    protectionSectionCube: string;
    protectionSectionLayerCircle: string;
    protectionSectionSecureCircle: string;
    protectionSectionChat: string;
    stockflowRetirementBackground: string;
    stockflowGoldBackground: string;
    investingHeroLargeBackground: string;
    investingHeroSmallBackground: string;
    investingHeroMediumBackground: string;
    investingHeroDefaultBackground: string;
    investingHeroMediumBackground: string;
    cryptoHeroLargeBackground: string;
    cryptoHeroSmallBackground: string;
    cryptoHeroMediumBackground: string;
    cryptoHeroDefaultBackground: string;
    cryptoHeroMediumBackground: string;
    stockflowCryptoLogo: string;
    stockflowLearnPhoneSmall: string;
    stockflowLearnPhoneDefault: string;
    stockflowNewGenInvestorsBackground: string;
    signupTaxInfoImage: string;
    applicationAgreementInfo: string;
    signupBasicInfoImage: string;
    signupInvestingExperienceImage: string;
    signupContactInfoImage: string;
    signupFundAccountImage: string;
    taxPapersInfo: string;
    currentUser: any;
    Stockflow: any;
    stockflowIcon: string;
    stockflowRetirementLogo: string;
    dashboardGraphReplacementBackground: string;
    newlyListedCryptoIcon: string;
    tradableCryptoIcon: string;
    ipoAccessIcon: string;
    altcoinsIcon: string;
    hundredMostPopularIcon: string;
    dailyMoversIcon: string;
    cannabisIcon: string;
    upcomingEarningsIcon: string;
    twentyFourHourMarketIcon: string;
    techMediaTelecomIcon: string;
    etfIcon: string;
    energyIcon: string;
    pharmaIcon: string;
    growthValueEtfIcon: string;
    energyWaterIcon: string;
    healthcareIcon: string;
    consumerGoodsIcon: string;
    realEstateIcon: string;
    businessIcon: string;
    softwareIcon: string;
    sectorETFsIcon: string;
    automotiveIcon: string;
    realEstateETFsIcon: string;
    bankingIcon: string;
    bondETFsIcon: string;
    financeIcon: string;
    healthcareSuppliesIcon: string;
    commoditiesETFsIcon: string;
    whiteStar: string;
    cryptoBasicsTileIcon: string;
    cryptoTaxLossHarvestingTileIcon: string;
    differentInvestmentsTileIcon: string;
    etfBasicsTileIcon: string;
    goalsTileIcon: string;
    investingMythbustersTileIcon: string;
    ipoBasicsTileIcon: string;
    stockBasicsTileIcon: string;
    stockMarketInfoTileIcon: string;
    understandingRiskTileIcon: string;
    whyInvestTileIcon: string;
  }
};

interface ImportMetaEnv {
  readonly REACT_APP_POLYGON_API_KEY: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}