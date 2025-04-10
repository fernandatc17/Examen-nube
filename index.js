const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta principal para listar productos
app.get('/', async (req, res) => {
    const { data: productos, error } = await supabase.from('productos').select('*');
    res.render('productos', { productos, error });
});

// Añadir producto
app.post('/productos/add', async (req, res) => {
    const { nombre, precio, stock, estado } = req.body;
    const { error } = await supabase.from('productos').insert({ nombre, precio, stock, estado });
    res.redirect('/');
});

// Eliminar producto
app.post('/productos/delete/:id', async (req, res) => {
    const { id } = req.params;
    await supabase.from('productos').delete().eq('id', id);
    res.redirect('/');
});
// Ruta para cargar formulario de edición
app.get('/productos/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();

    if (error || !data) return res.send('Error: Producto no encontrado');

    res.render('edit', { producto: data });
});

// Ruta para guardar cambios editados
app.post('/productos/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, estado } = req.body;

    const { error } = await supabase
        .from('productos')
        .update({ nombre, precio, stock, estado })
        .eq('id', id);

    if (error) return res.send('Error al guardar los cambios.');

    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Aplicación corriendo en http://localhost:${port}`);
});
