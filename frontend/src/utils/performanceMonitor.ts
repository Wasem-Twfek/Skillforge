import React from 'react';

/**
 * Performance monitoring utility for SkillForge
 * This utility helps track and optimize application performance
 */

// Core Web Vitals metrics
interface PerformanceMetrics {
  // Loading metrics
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  TTI: number | null; // Time to Interactive
  
  // Interactivity metrics
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  
  // Custom application metrics
  routeChangeTime: Record<string, number[]>;
  apiCallTimes: Record<string, number[]>;
  renderTimes: Record<string, number[]>;
}

// Initialize metrics
const metrics: PerformanceMetrics = {
  FCP: null,
  LCP: null,
  TTI: null,
  FID: null,
  CLS: null,
  routeChangeTime: {},
  apiCallTimes: {},
  renderTimes: {}
};

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  // Only run in production or when explicitly enabled
  if (process.env.NODE_ENV !== 'production' && 
      (import.meta as any).env?.VITE_ENABLE_PERFORMANCE_MONITORING !== 'true') {
    console.log('Performance monitoring disabled in development mode');
    return;
  }
  
  try {
    // Monitor Core Web Vitals if the browser supports it
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fcp = entries[0];
          metrics.FCP = fcp.startTime;
          console.log(`FCP: ${metrics.FCP}ms`);
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lcp = entries[entries.length - 1];
          metrics.LCP = lcp.startTime;
          console.log(`LCP: ${metrics.LCP}ms`);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fid = entries[0];
          metrics.FID = (fid as any).processingStart - (fid as any).startTime;
          console.log(`FID: ${metrics.FID}ms`);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // Layout Shifts
      let cumulativeLayoutShift = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cumulativeLayoutShift += (entry as any).value;
            metrics.CLS = cumulativeLayoutShift;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
  } catch (error) {
    console.error('Error initializing performance monitoring:', error);
  }
}

/**
 * Track route change performance
 * @param route The route that was navigated to
 * @param startTime The time the navigation started
 */
export function trackRouteChange(route: string, startTime: number): void {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (!metrics.routeChangeTime[route]) {
    metrics.routeChangeTime[route] = [];
  }
  
  metrics.routeChangeTime[route].push(duration);
  
  console.log(`Route change to ${route}: ${duration.toFixed(2)}ms`);
}

/**
 * Track API call performance
 * @param endpoint The API endpoint that was called
 * @param startTime The time the API call started
 */
export function trackApiCall(endpoint: string, startTime: number): void {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (!metrics.apiCallTimes[endpoint]) {
    metrics.apiCallTimes[endpoint] = [];
  }
  
  metrics.apiCallTimes[endpoint].push(duration);
}

/**
 * Track component render time
 * @param componentName The name of the component
 * @param startTime The time the render started
 */
export function trackRenderTime(componentName: string, startTime: number): void {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (!metrics.renderTimes[componentName]) {
    metrics.renderTimes[componentName] = [];
  }
  
  metrics.renderTimes[componentName].push(duration);
}

/**
 * Get performance metrics summary
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...metrics };
}

/**
 * Custom hook for measuring component render time
 * @param componentName The name of the component
 */
export function useRenderTimeTracking(componentName: string): void {
  if (process.env.NODE_ENV !== 'production' && 
      (import.meta as any).env?.VITE_ENABLE_PERFORMANCE_MONITORING !== 'true') {
    return;
  }
  
  const startTime = performance.now();
  
  // Use React's layout effect to measure render time
  React.useLayoutEffect(() => {
    trackRenderTime(componentName, startTime);
    
    return () => {
      // Track unmount time if needed
    };
  }, [componentName, startTime]);
}

// Initialize performance monitoring when this module is imported
initPerformanceMonitoring();
