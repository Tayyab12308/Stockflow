// Define interfaces for the asset structure with specific keys
type ImageKey = 
  | 'whiteWarningIcon'
  | 'grayWarningIcon'
  | 'stockflowLogo'
  | 'protectionSectionCube'
  | 'protectionSectionLayerCircle'
  | 'protectionSectionSecureCircle'
  | 'protectionSectionChat'
  | 'stockflowGoldBackground'
  | 'investingHeroSmallBackground'
  | 'investingHeroMediumBackground'
  | 'investingHeroLargeBackground'
  | 'investingHeroDefaultBackground'
  | 'cryptoHeroSmallBackground'
  | 'cryptoHeroMediumBackground'
  | 'cryptoHeroLargeBackground'
  | 'cryptoHeroDefaultBackground'
  | 'stockflowCryptoLogo'
  | 'stockflowLearnPhoneSmall'
  | 'stockflowLearnPhoneDefault'
  | 'signupTaxInfoImage'
  | 'applicationAgreementInfo'
  | 'signupBasicInfoImage'
  | 'signupInvestingExperienceImage'
  | 'signupContactInfoImage'
  | 'signupFundAccountImage'
  | 'taxPapersInfo'
  | 'stockflowIcon'
  | 'stockflowRetirementLogo'
  | 'dashboardGraphReplacementBackground'
  | 'newlyListedCryptoIcon'
  | 'tradableCryptoIcon'
  | 'ipoAccessIcon'
  | 'altcoinsIcon'
  | 'hundredMostPopularIcon'
  | 'dailyMoversIcon'
  | 'cannabisIcon'
  | 'upcomingEarningsIcon'
  | 'twentyFourHourMarketIcon'
  | 'techMediaTelecomIcon'
  | 'etfIcon'
  | 'energyIcon'
  | 'pharmaIcon'
  | 'growthValueEtfIcon'
  | 'energyWaterIcon'
  | 'healthcareIcon'
  | 'consumerGoodsIcon'
  | 'realEstateIcon'
  | 'businessIcon'
  | 'softwareIcon'
  | 'sectorETFsIcon'
  | 'automotiveIcon'
  | 'realEstateETFsIcon'
  | 'bankingIcon'
  | 'bondETFsIcon'
  | 'financeIcon'
  | 'healthcareSuppliesIcon'
  | 'commoditiesETFsIcon'
  | 'whiteStar'
  | 'cryptoBasicsTileIcon'
  | 'cryptoTaxLossHarvestingTileIcon'
  | 'differentInvestmentsTileIcon'
  | 'etfBasicsTileIcon'
  | 'goalsTileIcon'
  | 'investingMythbustersTileIcon'
  | 'ipoBasicsTileIcon'
  | 'stockBasicsTileIcon'
  | 'stockMarketInfoTileIcon'
  | 'understandingRiskTileIcon'
  | 'whyInvestTileIcon';

type VideoKey = 
  | 'stockflowRetirementBackground'
  | 'stockflowNewGenInvestorsBackground';

interface AssetImages extends Record<ImageKey, string> {}
interface AssetVideos extends Record<VideoKey, string> {}

interface AssetsResponse {
  images: AssetImages;
  videos: AssetVideos;
}

// Asset service to manage loading and caching of assets
class AssetService {
  private assets: AssetsResponse | null = null;
  private loading: boolean = false;
  private loadPromise: Promise<AssetsResponse> | null = null;

  // Load assets and cache them
  public async loadAssets(): Promise<AssetsResponse> {
    if (this.assets) {
      return this.assets;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loading = true;
    this.loadPromise = fetch('/api/assets')
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Failed to load assets: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: AssetsResponse) => {
        this.assets = data;
        this.loading = false;
        return data;
      })
      .catch((error: Error) => {
        console.error('Error loading assets:', error);
        this.loading = false;
        throw error;
      });

    return this.loadPromise;
  }

  // Get an image by key with strong typing
  public getImage(key: ImageKey): string {
    if (!this.assets) {
      console.warn('Assets not loaded yet. Call loadAssets() first');
      return '';
    }
    return this.assets.images[key] || '';
  }
  
  // Get a video by key with strong typing
  public getVideo(key: VideoKey): string {
    if (!this.assets) {
      console.warn('Assets not loaded yet. Call loadAssets() first');
      return '';
    }
    return this.assets.videos[key] || '';
  }

  // For backward compatibility - get any asset by string key
  public getAsset(type: 'images' | 'videos', key: string): string {
    if (!this.assets) {
      console.warn('Assets not loaded yet. Call loadAssets() first');
      return '';
    }
    
    if (type === 'images') {
      return this.assets.images[key as ImageKey] || '';
    } else if (type === 'videos') {
      return this.assets.videos[key as VideoKey] || '';
    }
    
    return '';
  }

  // Check if assets are loaded
  public isLoaded(): boolean {
    return this.assets !== null;
  }

  // Check if assets are currently loading
  public isLoading(): boolean {
    return this.loading;
  }
}

// Create a singleton instance
const assetService = new AssetService();
export default assetService;