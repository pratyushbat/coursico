import mongoose from "mongoose";
// const connectionString: string = process.env.DB_URI || "";

const configDb = async () => {
  try {
    const connectionString: string = process.env.DB_URI || "";
    console.log('-------------connectionString---------------')
    console.log(connectionString)
    console.log('-------------process.env.DB_URI---------------')
    console.log(process.env.DB_URI)
    await mongoose.connect(connectionString,{
    dbName: 'myecomdb'
});
    console.log(`Database configurations success 🗳`);
  } catch (error: any) {
    console.log("failed to Database Configurations 😞",error);
  }
};

export default configDb;
