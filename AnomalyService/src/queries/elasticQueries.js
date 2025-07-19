export const getAnomalyQuery = (
  index = "vaultguard-token-logs",
  threshold = 10,
  windowMinutes = 5,
) => ({
  index,
  size: 0,
  query: {
    bool: {
      must: [
        { term: { event: "tokenize" } },
        {
          range: {
            "@timestamp": {
              gte: `now-${windowMinutes}m`,
              lte: "now",
            },
          },
        },
      ],
    },
  },
  aggs: {
    user_field: {
      composite: {
        size: 10000,
        sources: [
          { user: { terms: { field: "userId.keyword" } } },
          { field: { terms: { field: "field.keyword" } } },
          { appId: { terms: { field: "appId.keyword" } } },
        ],
      },
      aggs: {
        request_count: {
          value_count: { field: "field.keyword" },
        },
        filter_high_count: {
          bucket_selector: {
            buckets_path: { count: "request_count" },
            script: `params.count > ${threshold}`,
          },
        },
      },
    },
  },
});

// get all alerts for a user
export const getAlertsQuery = (index = "alerts", userId = null) => ({
  index: index,
  size: 1000,
  query: userId
    ? {
        bool: {
          must: [{ term: { "userId.keyword": userId } }],
        },
      }
    : { match_all: {} },
});

// Check if an alert exists for a user + field + company
export const getAlertExistsQuery = ({
  userId,
  field,
  appId,
  index = "alerts",
}) => ({
  index: index,
  size: 1,
  _source: false,
  query: {
    bool: {
      must: [
        { term: { "userId.keyword": userId } },
        { term: { "field.keyword": field } },
        { term: { "appId.keyword": appId } },
      ],
    },
  },
});
