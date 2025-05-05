const express = require('express');
const pug = require('pug');
const PORT = 3000;
const app = express();


app.get('/',(req,res)=> 
{
    const data = pug.renderFile('./views/index.pug')  
  res.send(data);
})

// ================== INICIAR SERVIDOR ==================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});