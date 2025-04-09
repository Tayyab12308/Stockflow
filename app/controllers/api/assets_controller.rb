class Api::AssetsController < ApplicationController
  # Skip CSRF protection for this API endpoint
  # skip_before_action :verify_authenticity_token, only: [:index]
  
  def index
    render json: {
      images: {
        whiteWarningIcon: helpers.asset_url("white_warning_icon.svg"),
        grayWarningIcon: helpers.asset_url("gray_warning_icon.svg"),
        stockflowLogo: helpers.asset_url("stockflow_logo.svg"),
        protectionSectionCube: helpers.asset_url("protection_section_cube.svg"),
        protectionSectionLayerCircle: helpers.asset_url("protection_section_layer_circle.svg"),
        protectionSectionSecureCircle: helpers.asset_url("protection_section_secure_circle.svg"),
        protectionSectionChat: helpers.asset_url("protection_section_chat.svg"),
        stockflowGoldBackground: helpers.asset_url("stockflow_gold_background.png"),
        investingHeroSmallBackground: helpers.asset_url("investing_hero_background_small.png"),
        investingHeroMediumBackground: helpers.asset_url("investing_hero_background_medium.png"),
        investingHeroLargeBackground: helpers.asset_url("investing_hero_background_large.png"),
        investingHeroDefaultBackground: helpers.asset_url("investing_hero_background_default.png"),
        cryptoHeroSmallBackground: helpers.asset_url("crypto_hero_background_small.jpg"),
        cryptoHeroMediumBackground: helpers.asset_url("crypto_hero_background_medium.jpg"),
        cryptoHeroLargeBackground: helpers.asset_url("crypto_hero_background_large.jpg"),
        cryptoHeroDefaultBackground: helpers.asset_url("crypto_hero_background_default.jpg"),
        stockflowCryptoLogo: helpers.asset_url("stockflow_crypto_logo.svg"),
        stockflowLearnPhoneSmall: helpers.asset_url("stockflow_learn_phone_small.png"),
        stockflowLearnPhoneDefault: helpers.asset_url("stockflow_learn_phone_default.png"),
        signupTaxInfoImage: helpers.asset_url("signup_tax_info.svg"),
        applicationAgreementInfo: helpers.asset_url("application_agreement_info.png"),
        signupBasicInfoImage: helpers.asset_url("signup_basic_info.svg"),
        signupInvestingExperienceImage: helpers.asset_url("signup_investing_experience.svg"),
        signupContactInfoImage: helpers.asset_url("signup_contact_info.svg"),
        signupFundAccountImage: helpers.asset_url("signup_fund_account_info.svg"),
        taxPapersInfo: helpers.asset_url("tax_papers_info.png"),
        stockflowIcon: helpers.asset_url("stockflow_icon.svg"),
        stockflowRetirementLogo: helpers.asset_url("stockflow_retirement_logo.svg"),
        dashboardGraphReplacementBackground: helpers.asset_url("dashboard_graph_replacement_background.svg"),
        newlyListedCryptoIcon: helpers.asset_url("newly_listed_crypto_icon.png"),
        tradableCryptoIcon: helpers.asset_url("tradable_crypto_icon.png"),
        ipoAccessIcon: helpers.asset_url("ipo_access_icon.png"),
        altcoinsIcon: helpers.asset_url("altcoins_icon.png"),
        hundredMostPopularIcon: helpers.asset_url("hundred_most_popular_icon.png"),
        dailyMoversIcon: helpers.asset_url("daily_movers_icon.png"),
        cannabisIcon: helpers.asset_url("cannabis_icon.png"),
        upcomingEarningsIcon: helpers.asset_url("upcoming_earnings_icon.png"),
        twentyFourHourMarketIcon: helpers.asset_url("twenty_four_hour_market_icon.png"),
        techMediaTelecomIcon: helpers.asset_url("tech_media_telecom_icon.png"),
        etfIcon: helpers.asset_url("etf_icon.png"),
        energyIcon: helpers.asset_url("energy_icon.png"),
        pharmaIcon: helpers.asset_url("pharma_icon.png"),
        growthValueEtfIcon: helpers.asset_url("growth_value_etf_icon.png"),
        energyWaterIcon: helpers.asset_url("energy_water_icon.png"),
        healthcareIcon: helpers.asset_url("healthcare_icon.png"),
        consumerGoodsIcon: helpers.asset_url("consumer_goods_icon.png"),
        realEstateIcon: helpers.asset_url("real_estate_icon.png"),
        businessIcon: helpers.asset_url("business_icon.png"),
        softwareIcon: helpers.asset_url("software_icon.png"),
        sectorETFsIcon: helpers.asset_url("sector_etfs_icon.png"),
        automotiveIcon: helpers.asset_url("automotive_icon.png"),
        realEstateETFsIcon: helpers.asset_url("real_estate_etfs_icon.png"),
        bankingIcon: helpers.asset_url("banking_icon.png"),
        bondETFsIcon: helpers.asset_url("bond_etfs_icon.png"),
        financeIcon: helpers.asset_url("finance_icon.png"),
        healthcareSuppliesIcon: helpers.asset_url("healthcare_supplies_icon.png"),
        commoditiesETFsIcon: helpers.asset_url("commodities_etfs_icon.png"),
        whiteStar: helpers.asset_url("white_star.svg"),
        cryptoBasicsTileIcon: helpers.asset_url("crypto_basics_tile_icon.png"),
        cryptoTaxLossHarvestingTileIcon: helpers.asset_url("crypto_tax_loss_harvesting_tile_icon.png"),
        differentInvestmentsTileIcon: helpers.asset_url("different_investments_tile_icon.png"),
        etfBasicsTileIcon: helpers.asset_url("etf_basics_tile_icon.png"),
        goalsTileIcon: helpers.asset_url("goals_tile_icon.png"),
        investingMythbustersTileIcon: helpers.asset_url("investing_mythbusters_tile_icon.png"),
        ipoBasicsTileIcon: helpers.asset_url("ipo_basics_tile_icon.png"),
        stockBasicsTileIcon: helpers.asset_url("stock_basics_tile_icon.png"),
        stockMarketInfoTileIcon: helpers.asset_url("stock_market_info_tile_icon.png"),
        understandingRiskTileIcon: helpers.asset_url("understanding_risk_tile_icon.png"),
        whyInvestTileIcon: helpers.asset_url("why_invest_tile_icon.png")        
      },
      videos: {
        stockflowRetirementBackground: helpers.asset_url("stockflow_retirement_background.webm"),
        stockflowNewGenInvestorsBackground: helpers.asset_url("stockflow_new_generation_investors.webm")
      }
    }
  end
end