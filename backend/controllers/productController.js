import { sql } from "../config/db.js"; // ✅ Ajout de .js

export const getProducts = async (req, res) => {
    try {
        const products = await sql`
        SELECT * FROM products 
        ORDER BY created_at DESC`;
        
        console.log("Fetched products: ", products);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch products" 
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await sql`
        SELECT * FROM products 
        WHERE id = ${id}`;
        
        if (product.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch product" 
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, image, price } = req.body;
        
        // Validation basique
        if (!name || !image || !price) {
            return res.status(400).json({
                success: false,
                message: "Name, image, and price are required"
            });
        }
        
        const newProduct = await sql`
        INSERT INTO products (name, image, price)
        VALUES (${name}, ${image}, ${price})
        RETURNING *`;
        
        res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to create product" 
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, price } = req.body;
        
        const updatedProduct = await sql`
        UPDATE products 
        SET name = ${name}, image = ${image}, price = ${price}
        WHERE id = ${id}
        RETURNING *`;
        
        if (updatedProduct.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update product" 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedProduct = await sql`
        DELETE FROM products 
        WHERE id = ${id}
        RETURNING *`;
        
        if (deletedProduct.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Product deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete product" 
        });
    }
};