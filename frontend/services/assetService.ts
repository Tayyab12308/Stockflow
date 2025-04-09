// app/frontend/services/assetService.ts
import axios from 'axios';

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
  private defaultImageValues: Record<string, string> = {};  // Fallback values for critical assets

  constructor() {
    console.log('[AssetService] Initializing');
  }

  private getCsrfToken(): string | null | undefined {
    console.log('[AssetService] Getting CSRF token');
    const token = document.querySelector("meta[name='csrf-token']")?.getAttribute("content");
    console.log('[AssetService] CSRF token found:', token ? 'Yes' : 'No');
    return token;
  }

  // Load assets and cache them
  public async loadAssets(): Promise<AssetsResponse> {
    console.log('[AssetService] loadAssets called');
    
    if (this.assets) {
      console.log('[AssetService] Using cached assets');
      return this.assets;
    }

    if (this.loadPromise) {
      console.log('[AssetService] Request already in progress, returning existing promise');
      return this.loadPromise;
    }

    console.log('[AssetService] Starting new request to fetch assets');
    this.loading = true;
    
    const csrfToken = this.getCsrfToken();
    console.log('[AssetService] Preparing request with CSRF token:', csrfToken);

    this.loadPromise = axios.get('/api/assets', {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    })
      .then(response => {
        console.log('[AssetService] Request successful', response.status);
        console.log('[AssetService] Response data structure:', 
          Object.keys(response.data).join(', '),
          'images count:', Object.keys(response.data.images || {}).length,
          'videos count:', Object.keys(response.data.videos || {}).length
        );
        
        // Additional validation for asset data structure
        if (!response.data.images || !response.data.videos) {
          console.error('[AssetService] Invalid response structure - missing images or videos');
          throw new Error('Invalid asset response structure');
        }
        
        this.assets = response.data as AssetsResponse;
        this.loading = false;
        
        // Log a few sample assets to verify content
        const sampleImages = Object.keys(this.assets.images).slice(0, 3);
        console.log('[AssetService] Sample image URLs:', 
          sampleImages.map(key => `${key}: ${this.assets?.images[key as ImageKey]?.substring(0, 30)}...`)
        );
        
        return this.assets;
      })
      .catch(error => {
        console.error('[AssetService] Error loading assets:');
        
        if (error.response) {
          console.error('[AssetService] Error status:', error.response.status);
          console.error('[AssetService] Error data:', error.response.data);
        } else if (error.request) {
          console.error('[AssetService] No response received from server');
          console.error('[AssetService] Request details:', error.request);
        } else {
          console.error('[AssetService] Error setting up request:', error.message);
        }
        
        console.error('[AssetService] Stack trace:', error.stack);
        this.loading = false;
        throw error;
      });

    return this.loadPromise;
  }

  // Get an image by key with strong typing
  public getImage(key: ImageKey): string {
    if (!this.assets) {
      console.warn(`[AssetService] Assets not loaded yet when requesting '${key}'. Call loadAssets() first`);
      // Return fallback value if available
      if (this.defaultImageValues[key]) {
        console.log(`[AssetService] Using fallback value for '${key}'`);
        return this.defaultImageValues[key];
      }
      this.loadAssets().catch(err => console.error('[AssetService] Failed to load assets:', err));
      return '';
    }
    
    if (!this.assets.images[key]) {
      console.warn(`[AssetService] Image with key '${key}' not found`);
      return this.defaultImageValues[key] || '';
    }
    
    return this.assets.images[key];
  }
  
  // Get a video by key with strong typing
  public getVideo(key: VideoKey): string {
    if (!this.assets) {
      console.warn(`[AssetService] Assets not loaded yet when requesting video '${key}'. Call loadAssets() first`);
      this.loadAssets().catch(err => console.error('[AssetService] Failed to load assets:', err));
      return '';
    }
    
    if (!this.assets.videos[key]) {
      console.warn(`[AssetService] Video with key '${key}' not found`);
      return '';
    }
    
    return this.assets.videos[key];
  }

  // For backward compatibility - get any asset by string key
  public getAsset(type: 'images' | 'videos', key: string): string {
    console.log(`[AssetService] getAsset called for ${type}/${key}`);
    
    if (!this.assets) {
      console.warn(`[AssetService] Assets not loaded yet when requesting ${type}/${key}. Call loadAssets() first`);
      
      if (type === 'images' && this.defaultImageValues[key]) {
        console.log(`[AssetService] Using fallback value for ${type}/${key}`);
        return this.defaultImageValues[key];
      }
      
      this.loadAssets().catch(err => console.error('[AssetService] Failed to load assets:', err));
      return '';
    }
    
    if (type === 'images') {
      if (!this.assets.images[key as ImageKey]) {
        console.warn(`[AssetService] Image '${key}' not found`);
        return this.defaultImageValues[key] || '';
      }
      return this.assets.images[key as ImageKey];
    } else if (type === 'videos') {
      if (!this.assets.videos[key as VideoKey]) {
        console.warn(`[AssetService] Video '${key}' not found`);
        return '';
      }
      return this.assets.videos[key as VideoKey];
    }
    
    return '';
  }

  // Check if assets are loaded
  public isLoaded(): boolean {
    const loaded = this.assets !== null;
    console.log('[AssetService] isLoaded check:', loaded);
    return loaded;
  }

  // Check if assets are currently loading
  public isLoading(): boolean {
    console.log('[AssetService] isLoading check:', this.loading);
    return this.loading;
  }
  
  // Force reload assets (useful for debugging or after long sessions)
  public async reloadAssets(): Promise<AssetsResponse> {
    console.log('[AssetService] Force reloading assets');
    this.assets = null;
    this.loadPromise = null;
    return this.loadAssets();
  }
  
  // Get debug information
  public debugInfo(): object {
    return {
      hasAssets: !!this.assets,
      isLoading: this.loading,
      hasPendingPromise: !!this.loadPromise,
      imageKeysCount: this.assets ? Object.keys(this.assets.images).length : 0,
      videoKeysCount: this.assets ? Object.keys(this.assets.videos).length : 0,
      documentHasCsrfMeta: !!document.querySelector("meta[name='csrf-token']"),
      csrfToken: this.getCsrfToken()?.substring(0, 10) + '...' // Show just the beginning for security
    };
  }
}

// Create a singleton instance
const assetService = new AssetService();
export default assetService;