

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, query: "status:active AND product_type:Tobacco Snuff") {
      edges {
        node {
          handle
          title
          productType
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
      productType
      vendor
      featuredImage {
        url
      }
    }
  }
`
