import localForage from 'localforage';
 
export const podcastsCache = localForage.createInstance({
  name: 'podcasts'
});