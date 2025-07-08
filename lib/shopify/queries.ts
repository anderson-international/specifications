// Shopify GraphQL queries

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, query: "status:active") {
      edges {
        node {
          handle
          title
          vendor
          featuredImage {
            url
          }
          metafields(namespace: "custom", first: 10) {
            edges {
              node {
                key
                value
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

export const SINGLE_PRODUCT_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      handle
      title
      vendor
      featuredImage {
        url
      }
    }
  }
`
