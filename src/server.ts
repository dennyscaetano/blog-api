import app from './app'; // Importa a aplicação Express configurada

const PORT = 3000; // Define a porta em que o servidor irá escutar
const server = app.listen(PORT, () => {
  // Inicia o servidor e exibe uma mensagem no console quando o servidor estiver ouvindo
  console.log(`App listening to port ${PORT}`);
});

process.on('SIGINT', () => {
  // Encerra o servidor quando um sinal de interrupção (Ctrl+C) for recebido
  server.close();
  console.log('Server closed');
});