import {gql} from "@apollo/client";

export const getSiteDataFromAckee = gql`
query getDomainsStats($id: ID!) {
  domain(id: $id) {
    id
    title
    facts {
      activeVisitors
      averageViews {
        count
        change
      }
      averageDuration {
        count
        change
      }
      viewsToday
      viewsMonth
      viewsYear
    }
    statistics {
      views(type: UNIQUE, interval: DAILY, limit: 30) {
        id
        value
        count
      }
      pages(sorting: TOP, range: LAST_30_DAYS) {
        id
        value
        count
      }
      referrers(type: WITH_SOURCE, sorting: TOP, range: LAST_30_DAYS) {
        id
        value
        count
      }
      durations(interval: DAILY, limit: 30) {
        id
        value
        count
      }
      systems(type: WITH_VERSION, sorting: TOP, range: LAST_30_DAYS) {
        id
        value
        count
      }
      devices(type: WITH_MODEL, sorting: TOP, range: LAST_30_DAYS) {
        id
        value
        count
      }
      browsers(type: WITH_VERSION, sorting: TOP, range: LAST_30_DAYS) {
        id
        value
        count
      }
      sizes(type: SCREEN_RESOLUTION, sorting: TOP, range: LAST_30_DAYS) {
        id
        value
        count
      }
    }
  }
}
`;