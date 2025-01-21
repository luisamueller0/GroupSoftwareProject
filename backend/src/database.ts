import {DataTypes, Sequelize} from 'sequelize';
export class Database {

  private static instance : Database;

  private sequelize = new Sequelize('postgres://admin:CHOOSE_A_PASSWORD@localhost:50000/postgres',{
    define:{
        timestamps: false
    }
  });

  public async initDB(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  }


  private constructor(){
    this.initDB();
    this.Events.belongsTo(this.Locations ,{as :'eventLocation', foreignKey:'location',targetKey: 'name'}); // create join condition between Events and Locations Events.location === Locations.name 
    //Tickets
    this.Users.hasMany(this.Tickets,{foreignKey: 'user_id'});
    this.Tickets.belongsTo(this.Users, {foreignKey: 'user_id'});
    this.Events.hasMany(this.Tickets,{foreignKey: 'event_id'});
    this.Tickets.belongsTo(this.Events, {foreignKey: 'event_id'});
    this.Orders.hasMany(this.Tickets, {foreignKey: 'order_id'});
    this.Tickets.belongsTo(this.Orders, {foreignKey: 'order_id'});
    //Evaluation
    this.Users.hasMany(this.Evaluation, {foreignKey: 'user_id'});
    this.Evaluation.belongsTo(this.Users, {foreignKey: 'user_id'});
    this.Evaluation.belongsTo(this.Events, {foreignKey: 'event_id'});
    this.Events.hasMany(this.Evaluation, {foreignKey: 'event_id'});

    //evaluationEvaluate
    this.Users.hasMany(this.Helpful, {foreignKey: 'user_id'});
    this.Helpful.belongsTo(this.Users, {foreignKey: 'user_id'});
    this.Evaluation.hasMany(this.Helpful, {foreignKey: 'eval_id'});
    this.Helpful.belongsTo(this.Evaluation, {foreignKey: ' eval_id'});

    //shoppingCart
    this.Events.hasMany(this.ShoppingCart,{foreignKey: 'event_id'});
    this.ShoppingCart.belongsTo(this.Events,{foreignKey: 'event_id'});
    this.Users.hasMany(this.ShoppingCart,{foreignKey: 'user_id'});
    this.ShoppingCart.belongsTo(this.ShoppingCart,{foreignKey: 'user_id'});

    //Orders
    this.Users.hasMany(this.Orders, {foreignKey: 'user_id'});
    this.Orders.belongsTo(this.Users, {foreignKey: 'user_id'});
  }

  public static getInstance() : Database{
    if(!Database.instance){
        Database.instance = new Database();
    }

    return Database.instance;

  }

  public getSequelize() : Sequelize {
    return this.sequelize;
  }

  // Database Models
  public Users = this.sequelize.define('users',{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  public Sessions = this.sequelize.define('sessions',{
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  public Locations = this.sequelize.define('locations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    coordinates_lat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    coordinates_lng: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description_html: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  public Events = this.sequelize.define('events', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    price_child: {
      type: DataTypes.DECIMAL(10, 2),
    },
    price_senior: {
      type: DataTypes.DECIMAL(10, 2),
    },
    price_student: {
      type: DataTypes.DECIMAL(10, 2),
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description_html: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  public Tickets = this.sequelize.define('tickets',{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  public Evaluation = this.sequelize.define('evaluation',{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    anonym:{
      type:DataTypes.BOOLEAN,
      allowNull: false
    },
    user_id:{
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    event_id:{
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    stars:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  public Helpful = this.sequelize.define('helpful',{
    id:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    eval_id:{
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id:{
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    helpful:{
      type: DataTypes.BOOLEAN,
      allowNull:true
    }
  }, {
    createdAt: false,
    updatedAt: false
  });

  public ShoppingCart = this.sequelize.define('shopping_cart',{
    user_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }, 
    event_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    normal_amount:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    child_amount:{
      type:DataTypes.INTEGER,
      allowNull: false
    },
    senior_amount:{
      type:DataTypes.INTEGER,
      allowNull: false
    },
    student_amount:{
      type:DataTypes.INTEGER,
      allowNull: false
    },
  });
  
  public Orders = this.sequelize.define('orders', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2)
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    placed_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    service: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

}



