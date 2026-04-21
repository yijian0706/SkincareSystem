import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());

// 1. 数据库连接 - 保持你的端口 3307 和配置不变
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307, 
    user: 'jingyuan',
    password: 'Tyj@0081!',
    database: 'skincare_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Successfully connected to MySQL database');
});

// --- USER MODULE ---

// Register
app.post('/api/skincare/register', async (req, res) => {
    const { username, password, email, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = "INSERT INTO users (username, password, email, address, role, has_loyalty_promo) VALUES (?, ?, ?, ?, 'customer', 0)";
        db.query(sql, [username, hashedPassword, email, address], (err, result) => {
            if (err) return res.json({ status: "Error", message: "Registration failed: " + err.sqlMessage });
            return res.json({ 
                status: "Success", 
                message: "Welcome to LUMIÈRE! Registration successful.",
                user: { id: result.insertId, username, address, role: 'customer' }
            });
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Security encryption failed." });
    }
});

// Login
app.post('/api/skincare/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).json({ status: "Error", message: "Database access error." });
        if (result.length > 0) {
            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json({ 
                    status: "Success", 
                    message: "Login successful. Welcome back!",
                    user: { id: user.id, username: user.username, address: user.address, email: user.email, role: user.role } 
                });
            } else {
                res.json({ status: "Error", message: "Invalid email or password." });
            }
        } else {
            res.json({ status: "Error", message: "Account not found." });
        }
    });
});

// --- ORDER MODULE ---

// Checkout (含库存、奖励检查、销券)
app.post('/api/skincare/checkout', (req, res) => {
    const { user_id, fullName, email, address, total, discount, cart } = req.body;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ status: "Error", message: "Server transaction error." });

        const orderSql = "INSERT INTO orders (user_id, full_name, email, address, total_amount) VALUES (?, ?, ?, ?, ?)";
        db.query(orderSql, [user_id, fullName, email, address, total], (err, result) => {
            if (err) return db.rollback(() => res.status(500).json({ status: "Error", message: "Failed to create order record." }));
            const orderId = result.insertId;

            const itemSql = "INSERT INTO order_items (order_id, product_name, price, quantity) VALUES ?";
            const itemValues = cart.map(item => [orderId, item.name, parseFloat(item.price.toString().replace('$', '')), item.quantity]);

            db.query(itemSql, [itemValues], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ status: "Error", message: "Failed to save order items." }));

                const stockUpdatePromises = cart.map(item => {
                    return new Promise((resolve, reject) => {
                        const updateStockSql = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";
                        db.query(updateStockSql, [item.quantity, item.id, item.quantity], (sErr, sRes) => {
                            if (sErr) reject(sErr);
                            else if (sRes.affectedRows === 0) reject(new Error(`Stock insufficient for: ${item.name}`));
                            else resolve();
                        });
                    });
                });

                Promise.all(stockUpdatePromises).then(() => {
                    db.commit((err) => {
                        if (err) return db.rollback(() => res.status(500).json({ status: "Error", message: "Finalizing order failed." }));

                        // 销券逻辑
                        if (discount > 0 && user_id) {
                            db.query("UPDATE users SET has_loyalty_promo = 2 WHERE id = ?", [user_id]);
                        }

                        // 奖励逻辑
                        if (user_id) {
                            const sumSql = "SELECT SUM(total_amount) as grandTotal FROM orders WHERE user_id = ? AND status != 'Cancelled'";
                            db.query(sumSql, [user_id], (sumErr, sumResult) => {
                                const grandTotal = sumResult[0]?.grandTotal || 0;
                                if (!sumErr && grandTotal >= 500) {
                                    db.query("SELECT has_loyalty_promo FROM users WHERE id = ?", [user_id], (uErr, uRes) => {
                                        if (!uErr && uRes[0].has_loyalty_promo === 0) {
                                            db.query("UPDATE users SET has_loyalty_promo = 1 WHERE id = ?", [user_id]);
                                            return res.json({ 
                                                status: "Success", 
                                                message: "Ritual confirmed! Loyalty Reward Unlocked. ✨", 
                                                orderId, promoCode: "LUMIERE500" 
                                            });
                                        }
                                        res.json({ status: "Success", message: "Order confirmed successfully.", orderId });
                                    });
                                } else {
                                    res.json({ status: "Success", message: "Order confirmed successfully.", orderId });
                                }
                            });
                        } else {
                            res.json({ status: "Success", message: "Order confirmed.", orderId });
                        }
                    });
                }).catch(stockErr => {
                    db.rollback(() => res.status(400).json({ status: "Error", message: stockErr.message }));
                });
            });
        });
    });
});

// Verify Promo Code
app.post('/api/skincare/verify-promo', (req, res) => {
    const { promoCode, userId } = req.body;
    if (!promoCode || promoCode.toUpperCase() !== "LUMIERE500") {
        return res.json({ status: "Error", message: "The promo code you entered is invalid." });
    }
    const sql = "SELECT has_loyalty_promo FROM users WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ status: "Error", message: "Verification system error." });
        if (result.length > 0) {
            const status = result[0].has_loyalty_promo;
            if (status === 1) {
                res.json({ status: "Success", message: "Promo code applied! Ritual discount activated.✨", discountAmount: 20.00 });
            } else if (status === 2) {
                res.json({ status: "Error", message: "This promo code has already been used." });
            } else {
                res.json({ status: "Error", message: "Reward not unlocked. Reach RM500 cumulative spending." });
            }
        } else {
            res.json({ status: "Error", message: "User account verification failed." });
        }
    });
});

// Order History
app.get('/api/skincare/orders/:userId', (req, res) => {
    const sql = `SELECT o.*, GROUP_CONCAT(oi.product_name, ' (x', oi.quantity, ')') as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = ? GROUP BY o.id ORDER BY o.created_at DESC`;
    db.query(sql, [req.params.userId], (err, data) => {
        if (err) return res.status(500).json({ status: "Error", message: "Failed to fetch ritual history." });
        res.json(data);
    });
});

// --- ADMIN MODULE ---

app.get('/api/admin/orders', (req, res) => {
    const sql = "SELECT o.*, u.username FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ status: "Error", message: "Orders load failed." });
        res.json(data);
    });
});

app.put('/api/admin/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
        if (err) return res.status(500).json({ status: "Error", message: "Status update failed." });
        res.json({ status: "Success", message: "Order status updated successfully." });
    });
});

app.get('/api/admin/users', (req, res) => {
    db.query("SELECT id, username, email, address, role FROM users WHERE role = 'customer'", (err, data) => {
        if (err) return res.status(500).json({ status: "Error", message: "User list load failed." });
        res.json(data);
    });
});

app.put('/api/admin/users/:id', (req, res) => {
    const { username, email, address, role } = req.body;
    const sql = "UPDATE users SET username = ?, email = ?, address = ?, role = ? WHERE id = ?";
    db.query(sql, [username, email, address, role, req.params.id], (err) => {
        if (err) return res.status(500).json({ status: "Error", message: "Member update failed." });
        res.json({ status: "Success", message: "Member profile updated." });
    });
});

app.get('/api/admin/products', (req, res) => {
    db.query("SELECT * FROM products ORDER BY id DESC", (err, data) => {
        if (err) return res.status(500).json({ status: "Error", message: "Inventory load failed." });
        res.json(data);
    });
});

app.post('/api/admin/products', (req, res) => {
    const { name, price, category, image_url, stock } = req.body;
    const sql = "INSERT INTO products (name, price, category, image_url, stock, is_active) VALUES (?, ?, ?, ?, ?, 1)";
    db.query(sql, [name, price, category, image_url, stock], (err) => {
        if (err) return res.status(500).json({ status: "Error", message: "Product launch failed." });
        res.json({ status: "Success", message: "Product launched successfully." });
    });
});

app.put('/api/admin/products/:id', (req, res) => {
    const { name, price, category, image_url, stock } = req.body;
    const sql = "UPDATE products SET name = ?, price = ?, category = ?, image_url = ?, stock = ? WHERE id = ?";
    db.query(sql, [name, price, category, image_url, stock, req.params.id], (err) => {
        if (err) return res.status(500).json({ status: "Error", message: "Product update failed." });
        res.json({ status: "Success", message: "Product updated successfully." });
    });
});

app.put('/api/admin/products/:id/toggle', (req, res) => {
    const sql = "UPDATE products SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ status: "Error", message: "Visibility toggle failed." });
        res.json({ status: "Success", message: "Visibility updated." });
    });
});

app.delete('/api/admin/products/:id', (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ status: "Error", message: "Removal failed." });
        res.json({ status: "Success", message: "Item removed from collection." });
    });
});

app.get('/api/skincare/products', (req, res) => {
    db.query("SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC", (err, data) => {
        if (err) return res.status(500).json({ status: "Error", message: "Could not load products." });
        res.json(data);
    });
});

app.listen(8082, () => console.log('🚀 LUMIÈRE API is running on http://localhost:8082'));