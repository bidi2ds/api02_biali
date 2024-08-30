// consultar tarefas existentes
//inserier uma nova task

//1 require
const express = require ('express');
const mysql = require('mysql2');
const cors = require('cors');

const mysql_config = require ('./inc/mysql_config');
const functions = require('./inc/functions');

//2 criação de duas constantes para a definição da disponibilidade da api e da versão da api
const API_AVAILABILITY = true;
const API_VERSION = "2.0.0";

//3 iniciar o server

const app = express()
app.listen(3000,()=>{
    console.log("APi esta executando")
})

//4 checar se a API esta disponivel

app.use((req,res,next)=>{
    if(API_AVAILABILITY){
        next();
    }else{
        res.json(functions.response("Atenção", "API esta em manutenção. Sinto muito",0,null))
    }
})

//5 mysql connection

const connection = mysql.createConnection(mysql_config);

//6 cors

app.use(cors());


//tratamento dos posts paramas
app.use(json());
//introduçao que pede que o express trate os dados com json 

app.use(express.urlencoded({extended: true}));
//quando e envaido um pedido atraves do metodo post, os dados enviados 
//atraves de um formulario podem ser interpretados 
//SEM ESSES DOIS MIDLEWARE NAO SERIA POSSIVEL BUSCAR OS PARAMETROS

//

//7 rotas 
//rotas em inicial que vai dizer que a APi esta disṕonivel 

app.get('/',(req,res)=>{
    res.json(functions.response('sucesso','api esta rodando',0,null))
})

// rota para pegar todas as tarefas
app.get('/tasks', (req,res)=>{
     connection.query("SELECT * FROM tasks",(err,rows))
})

// rota para pegar a task pelo id
app.get("/tasks/:id",(req,res)=>{
    const id = req.params.id;
    connection.query('SELECT *FROM tasks WERE id=?',(id),(err,rows)=>{
        if(err){
            //devolver os dados da task
            if(rows.lenght>0){
                res.json(functions.response("Sucesso","Sucesso na pesquisa",rows.lenght,rows))
            }else{
                res.json(functions.response('Atenção', 'Não foi possivel encontrar a task solicitada',0,null))
            }
        }
        else{
            res.json(functions.response("error",err.message,0,null))
        }
    })
})

11// rota para atualizar o status de uma tasks - método put 
app.put('/tasks/:id/status/:status',(req,res)=>{
    const id  = req.paramas.id;
    const status =  req.paramas.status;
    connection.query('UPDATE tasks SET status =? WHERE id =?',(status,id),(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('sucesso','suceso na alteração do status',rows.affectedRows,null))

            }
            else{
                res.json(functions.response('atenção','tasks não encontrada',0,null))

            }
        }
        else{
            res.json(functions.response('erro',err.message,0,null))

        }
    })
})

//rota para declarar uma tarefa 
app.delete('/tasks/:/delete', (req,res)=>{
    const id=req.params.id;
    connection.query('DELETE FROM tasks WHER ID=?',[id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('sucesso','task deletada',rows.affectedRows,null))
            }
            else{
                res.json(functions.response('atencao','task nao encontrada',0,null))
            
            }            
        }
        else{
            res.json(functions.response('erro',err.mensage,0,null))
        }
    })
})

//rota para inserir uma nova task
app.put('/tasks/create',(req,res)=>{
    //midleware para a recepção dos dados da tarefa (task)

    //pegando os dados da request
    const post_data= req.body;

    //checar se não estamos recebendo json vazia
    if(post_data ==undefined){
        res.json(functions.response('Atenção','Sem dados de uma nova task',0,null))
        return;
    }
    const task = post_data.task;
    const status = post_data.status;

    //Inserindo a nova task 
    connection.query('INSERT INTO tasks(task,status,created_at,update_at) VALUES(?,?,NOW(),NOW()',[task,status],(err,rows)=>{
        if(!err){
            res.json("Sucesso","Task cadastrada no banco",rows.affectedRows,null)
        }
        else{
            res.json(functions.response('Erro',err.message,0,null))
        }
    })
   
})

//mydlware para caso alguma rota não seja encontrada 

app.use((req,res)=>{
    res.json(functions.response('Atenção','rota não encontrada',0,null))
})

