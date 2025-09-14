const express=require('express');
const path=require('path');
const fs=require('fs');
const app=express();
const PORT=3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

const ordersFile=path.join(__dirname, 'orders.json');

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '[]', 'utf-8');
}

function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading JSON', filePath, err);
    return [];
  }
}
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON', filePath, err);
  }
}

app.get('/api/orders', (req, res) => {
  const orders = readJSON(ordersFile);
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }
    if (!address || !address.name) {
      return res.status(400).json({ success: false, message: 'Invalid address' });
    }
    const orders = readJSON(ordersFile);
    const newOrder = {
      id: Date.now(),
      items,
      total: items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0),
      date: new Date().toLocaleString(),
      address,
      paymentMethod,
      status: 'Delivered'
    };
    orders.push(newOrder);
    writeJSON(ordersFile, orders);
    return res.json({ success: true, ...newOrder });
  } catch (err) {
    console.error('Failed to place order', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/orders', (req, res) => {
    const ordersFile = path.join(__dirname, 'orders.json');
    writeJSON(ordersFile, []);
    res.json({ success: true, message: 'All orders cleared' });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/menu.html', (req, res) => res.sendFile(path.join(__dirname, 'menu.html')));
app.get('/cart.html', (req, res) => res.sendFile(path.join(__dirname, 'cart.html')));
app.get('/payment.html', (req, res) => res.sendFile(path.join(__dirname, 'payment.html')));
app.get('/orders.html', (req, res) => res.sendFile(path.join(__dirname, 'orders.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/profile.html', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
