export interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    allergens?: string;
    allergens_tags?: string[];
    ingredients?: Array<{
      text: string;
      id: string;
    }>;
    image_url?: string;
    nutrition_grades?: string;
  };
  status: number;
  status_verbose: string;
}

const BASE_URL = 'https://world.openfoodfacts.org/api/v0';

export const searchProductByBarcode = async (barcode: string): Promise<OpenFoodFactsProduct | null> => {
  try {
    const response = await fetch(`${BASE_URL}/product/${barcode}.json`);
    const data: OpenFoodFactsProduct = await response.json();
    
    if (data.status === 1 && data.product) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product from Open Food Facts:', error);
    return null;
  }
};

export const searchProductsByName = async (query: string): Promise<OpenFoodFactsProduct[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`
    );
    const data = await response.json();
    
    if (data.products && Array.isArray(data.products)) {
      return data.products.map((product: any) => ({
        code: product.code,
        product: product,
        status: 1,
        status_verbose: 'product found'
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching products from Open Food Facts:', error);
    return [];
  }
};