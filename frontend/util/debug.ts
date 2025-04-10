// app/frontend/utils/debug.ts
interface DebugOptions {
  namespace: string;
  prefix?: string;
  enabled?: boolean;
}

export function createDebugger(options: DebugOptions) {
  const namespace = options.namespace || 'default';
  // Use custom prefix if provided, otherwise use namespace
  const displayPrefix = options.prefix || `[${namespace}] `;
  
  // Check if this specific namespace or all debugging is enabled
  const isDebugEnabled = () => {
    // Check for global debug flag
    const globalDebug = localStorage.getItem('debug') === 'true';
    
    // Check for namespace-specific debug flag
    const namespaceKey = `debug:${namespace}`;
    const namespaceDebug = localStorage.getItem(namespaceKey) === 'true';
    
    // Check for namespace patterns (e.g., debug:api:* would enable all api:* namespaces)
    const enabledPatterns = localStorage.getItem('debug:patterns');
    const patternEnabled = enabledPatterns ? checkPatternMatch(namespace, enabledPatterns) : false;
    
    return options.enabled !== undefined 
      ? options.enabled 
      : globalDebug || namespaceDebug || patternEnabled;
  };
  
  // Check if a namespace matches any pattern in the patterns string
  const checkPatternMatch = (ns: string, patterns: string): boolean => {
    const patternList = patterns.split(',');
    return patternList.some(pattern => {
      if (pattern.endsWith('*')) {
        // Handle wildcard patterns like 'api:*'
        const prefix = pattern.slice(0, -1);
        return ns.startsWith(prefix);
      }
      return ns === pattern;
    });
  };

  return {
    log: (message: string, ...args: any[]) => {
      if (isDebugEnabled()) {
        console.log(`${displayPrefix}${message}`, ...args);
      }
    },
    error: (message: string, ...args: any[]) => {
      // Always log errors
      console.error(`${displayPrefix}${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      // Always log warnings
      console.warn(`${displayPrefix}${message}`, ...args);
    },
    info: (message: string, ...args: any[]) => {
      if (isDebugEnabled()) {
        console.info(`${displayPrefix}${message}`, ...args);
      }
    },
    debug: (message: string, ...args: any[]) => {
      if (isDebugEnabled()) {
        console.debug(`${displayPrefix}${message}`, ...args);
      }
    },
    // Check if debugging is enabled for this namespace
    isEnabled: () => isDebugEnabled(),
    // Get this debugger's namespace
    getNamespace: () => namespace,
    // Get this debugger's display prefix
    getPrefix: () => displayPrefix
  };
}

// Add global utility functions to enable/disable debugging
export const debugUtil = {
  // Enable debug for all namespaces
  enableAll: () => {
    localStorage.setItem('debug', 'true');
    console.log('Debug logging enabled for all namespaces');
  },
  
  // Disable debug for all namespaces
  disableAll: () => {
    localStorage.removeItem('debug');
    console.log('Debug logging disabled for all namespaces');
  },
  
  // Enable debug for a specific namespace
  enable: (namespace: string) => {
    localStorage.setItem(`debug:${namespace}`, 'true');
    console.log(`Debug logging enabled for namespace: ${namespace}`);
  },
  
  // Disable debug for a specific namespace
  disable: (namespace: string) => {
    localStorage.removeItem(`debug:${namespace}`);
    console.log(`Debug logging disabled for namespace: ${namespace}`);
  },
  
  // Enable debug for namespaces matching patterns (comma-separated)
  enablePatterns: (patterns: string) => {
    localStorage.setItem('debug:patterns', patterns);
    console.log(`Debug logging enabled for patterns: ${patterns}`);
  },
  
  // List all currently enabled debug namespaces
  listEnabled: () => {
    // Use a more flexible type that can hold both booleans and strings
    const result: Record<string, boolean | string> = {};
    
    // Check global setting
    result.all = localStorage.getItem('debug') === 'true';
    
    // Check patterns
    const patterns = localStorage.getItem('debug:patterns');
    if (patterns) {
      result.patterns = patterns;
    }
    
    // Find all namespace-specific settings
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('debug:') && key !== 'debug:patterns') {
        const namespace = key.substring(6);
        result[namespace] = localStorage.getItem(key) === 'true';
      }
    }
    
    console.table(result);
    return result;
  }
};