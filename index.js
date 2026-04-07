import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;
var vet_leitor = [];
var vet_livro = [];

const server = express();

server.use(session({
  secret: "S3cr3tK3y",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*15}
}));

server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));

server.get("/",verLogin,(req,res) => {

let ultimoAcesso = req.cookies?.ultimoAcesso;

const data = new Date();
res.cookie("ultimoAcesso",data.toLocaleString());

res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <nav class="navbar" style="background-color: #e3f2fd;" data-bs-theme="light">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Menu</a>
      <div class="navbar-nav">
        <a class="nav-link" href="/cadastrarLivros">Cadastrar Livros</a>
        <a class="nav-link" href="/cadastrarLeitores">Cadastrar Leitores</a>
        <p class="nav-link">Útlimo acesso: ${ultimoAcesso || "Primeiro Acesso"}</p>
        <a class="nav-link" href="/logout">Sair</a>
      </div>
    </div>
  </div>
</nav>
</nav>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `)
});

server.get("/cadastrarLivros",verLogin,(req,res) =>{
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Livros</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Cadastro de Livros</h2>
        <form class="row g-3" method="post" action="/adicionarLivros">
  <div class="col-md-4">
    <label>Título do Livro</label>
    <input type="text" class="form-control" id="titulo" name="titulo">
  </div>
  <div class="col-md-4">
    <label>Autor</label>
    <input type="text" class="form-control" id="autor" name="autor">
  </div>
  <div class="col-md-4">
    <label>Código ISBN</label>
    <input type="text" class="form-control" id="isbn" name="isbn">
  </div>
  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit">Enviar</button>
  </div>
</form>
    </div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>    
</body>
</html>    
        `)
});

server.post("/adicionarLivros",verLogin,(req,res) =>{
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const cod = req.body.isbn;

    if(titulo && autor && cod) {
  vet_livro.push({titulo,autor,cod});
  return res.redirect("/listarLivros");
  }

    let conteudo = 
    `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Livros</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Cadastro de Livros</h2>
        <form class="row g-3" method="post" action="/adicionarLivros">
  <div class="col-md-4">
    <label>Título do Livro</label>
    <input type="text" class="form-control" id="titulo" name="titulo">
    `;

    if(!titulo) {
        conteudo+= `
 <div>
  <p class="text-danger">Informe o título do livro</p>
  </div>
        `
    }

    conteudo +=
    `
     </div>
  <div class="col-md-4">
    <label>Autor</label>
    <input type="text" class="form-control" id="autor" name="autor">
    `;

    if(!autor) {
    conteudo+= `
   <div>
  <p class="text-danger">Informe o autor do livro</p>
  </div>
        `
    }

    conteudo+=
    `
    </div>
  <div class="col-md-4">
    <label>Código ISBN</label>
    <input type="text" class="form-control" id="isbn" name="isbn">
    `;

    if(!cod) {
        conteudo+= `
   <div>
  <p class="text-danger">Informe o código do livro</p>
  </div>
        `
    }

    conteudo +=
    `
    </div>
  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit">Enviar</button>
  </div>
</form>
    </div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>    
</body>
</html>    
    `;

    res.send(conteudo);

});

server.get("/listarLivros",verLogin,(req,res) =>{
    let conteudo = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Leitores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Lista de Leitores</h2>
            <table class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Livro</th>
      <th scope="col">Autor</th>
      <th scope="col">Código IBSN</th>
    </tr>
  </thead>
  <tbody>
    `;

    for(let i=0; i<vet_livro.length; i++) {
        conteudo +=
        `
     <tr>
    <td>${i+1}</td>
    <td>${vet_livro[i].titulo}</td>
    <td>${vet_livro[i].autor}</td>
    <td>${vet_livro[i].cod}</td>
    </tr>
        `
    };

    conteudo+= `
</tbody>
</table>
<a class="btn btn-secondary" href="/">Voltar ao Menu</a>
    </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>  
</body>
    `;

    res.send(conteudo);
});

server.get("/cadastrarLeitores",verLogin,(req,res) =>{
    let conteudo =`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Leitores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Cadastro de Leitores</h2>
        <form class="row g-3" method="post" action="/adicionarLeitores">
  <div class="col-md-4">
    <label>Nome</label>
    <input type="text" class="form-control" id="nome" name="nome">
  </div>
  <div class="col-md-4">
    <label>CPF</label>
    <input type="tel" class="form-control" id="cpf" name="cpf">
  </div>
  <div class="col-md-4">
    <label>Telefone</label>
    <input type="tel" class="form-control" id="fone" name="fone">
  </div>
  <br/>
  <div class="col-md-4">
    <label>Data de Empréstimo</label>
    <input type="date" class="form-control" id="dataEmp" name="dataEmp">
  </div>
  <div class="col-md-4">
    <label>Data de Devolução</label>
    <input type="date" class="form-control" id="dataDev" name="dataDev">
  </div>
  <br/>
  <div class="col-md-3">
    <label>Livro</label>
    <select class="form-select" id="livro" name="livro">
      <option selected disabled value="">Selecione</option>
    `;

    for(let i=0; i<vet_livro.length; i++) {
        conteudo += `
        <option>${vet_livro[i].titulo}</option>
        `
    };

    conteudo += `
    </select>
  </div>
  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit"> Enviar</button>
  </div>
</form>
    </div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `;

    res.send(conteudo);
});

server.post("/adicionarLeitores",verLogin,(req,res) =>{
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const fone = req.body.fone;
    const dataEmp = req.body.dataEmp;
    const dataDev = req.body.dataDev;
    const livro = req.body.livro;

    if(nome && cpf && fone && dataEmp && dataDev && livro) {
  vet_leitor.push({nome,cpf,fone,dataEmp,dataDev,livro});
  return res.redirect("/listarLeitores");
  }

  let conteudo =`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Leitores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Cadastro de Leitores</h2>
        <form class="row g-3" method="post" action="/adicionarLeitores">
  <div class="col-md-4">
    <label>Nome</label>
    <input type="text" class="form-control" id="nome" name="nome">`;

    if(!nome) {
        conteudo+= `
 <div>
  <p class="text-danger">Informe o nome do leitor</p>
  </div>
        `
    }

    conteudo+= `
    </div>
  <div class="col-md-4">
    <label>CPF</label>
    <input type="tel" class="form-control" id="cpf" name="cpf">
    `;

    if(!cpf) {
        conteudo+= `
 <div>
  <p class="text-danger">Informe o CPF do leitor</p>
  </div>
        `
    }

    conteudo += `
    </div>
  <div class="col-md-4">
    <label>Telefone</label>
    <input type="tel" class="form-control" id="fone" name="fone">
    `;

    if(!fone) {
        conteudo+= `
 <div>
  <p class="text-danger">Informe o telefone do leitor</p>
  </div>
        `
    }

    conteudo += `
     </div>
  <br/>
  <div class="col-md-4">
    <label>Data de Empréstimo</label>
    <input type="date" class="form-control" id="dataEmp" name="dataEmp">
    `;

    if(!dataEmp) {
     conteudo+= `
 <div>
  <p class="text-danger">Informe a data de empréstimo</p>
  </div>
        `   
    }

    conteudo += `
     </div>
  <div class="col-md-4">
    <label>Data de Devolução</label>
    <input type="date" class="form-control" id="dataDev" name="dataDev">
    `;

    if(!dataDev) {
     conteudo+= `
 <div>
  <p class="text-danger">Informe a data de devolução</p>
  </div>
        `   
    }

    conteudo += `</div>
  <br/>
  <div class="col-md-3">
    <label>Livro</label>
    <select class="form-select" id="livro" name="livro">
      <option selected disabled value="">Selecione</option>
    `;

    for(let i=0; i<vet_livro.length; i++) {
        conteudo += `
        <option>${vet_livro[i].titulo}</option>
        `
    };

    if(!livro) {
        conteudo+= `
 <div>
  <p class="text-danger">Informe o livro</p>
  </div>
        ` 
    }

    conteudo += `
     </select>
  </div>
  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit"> Enviar</button>
  </div>
</form>
    </div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `;

    res.send(conteudo);
});

server.get("/listarLeitores",verLogin,(req,res)=>{
    let conteudo = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Leitores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Lista de Leitores</h2>
        <table class="table table-dark table-striped">
            <table class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Nome</th>
      <th scope="col">Livro</th>
      <th scope="col">Data Empréstimo</th>
      <th scope="col">Data Devolução</th>
    </tr>
  </thead>
  <tbody>
    `;

    for(let i=0; i<vet_leitor.length; i++) {
        conteudo +=
        `
     <tr>
    <td>${i+1}</td>
    <td>${vet_leitor[i].nome}</td>
    <td>${vet_leitor[i].livro}</td>
    <td>${vet_leitor[i].dataEmp}</td>
    <td>${vet_leitor[i].dataDev}</td>
    </tr>
        `
    }

    conteudo+= `
</tbody>
</table>
<a class="btn btn-secondary" href="/">Voltar ao Menu</a>
    </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>  
</body>
    `;

    res.send(conteudo);
});

server.get("/login",(req,res)=> {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Acesse</h2>
        <form class="row g-3" method="post" action="/login">
  <div class="col-md-4">
    <label>Usuário</label>
    <input type="text" class="form-control" id="usuario" name="usuario">
  </div>
  <div class="col-md-3">
    <label>Senha</label>
    <input type="password" class="form-control" id="senha" name="senha">
  </div>
  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit">Enviar</button>
  </div>
</form>
    </div>
    
</body>
</html>
    `)
})

server.post("/login",(req,res)=>{
  const {usuario,senha} = req.body;

    if(usuario==="admin" && senha==="admin") {
      req.session.dadosLogin = {nome:"ADM",logado:true};
      res.redirect("/");
    }

    else {
      res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: black;">
    <div style="background-color: rgb(206, 203, 203); margin-top: 10%; padding: 5% 5% 5% 5%;">
        <h2 style="font-family: cursive; text-align: center;">Acesse</h2>
        <form class="row g-3" method="post" action="/login">
  <div class="col-md-4">
    <label>Usuário</label>
    <input type="text" class="form-control" id="usuario" name="usuario">
  </div>
  <div class="col-md-3">
    <label>Senha</label>
    <input type="password" class="form-control" id="senha" name="senha">
  </div>
  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit">Enviar</button>
  </div>
</form>
    </div>
    
</body>
</html>
        `)
    }
});

server.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");
  })

  function verLogin(req,res,next) {
    if(req.session.dadosLogin?.logado)
      next();

    else 
      res.redirect("/login");
  }

server.listen(porta, host, () => {
console.log(`Servidor rodando em http://${host}:${porta}`) 
});

