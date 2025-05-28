import mongoose from 'mongoose';

const {
  MONGO_DB_NAME,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_CLUSTER
} = process.env;

export const initMongoConnection = async () => {
  try {
   
    if (!MONGO_DB_NAME || !MONGO_USER || !MONGO_PASSWORD || !MONGO_CLUSTER) {
      console.error('❌ ENV Check Failed:', {
        MONGO_DB_NAME,
        MONGO_USER,
        MONGO_PASSWORD,
        MONGO_CLUSTER,
      });
      throw new Error('Одна або декілька змінних оточення MongoDB не визначені');
    }

    const uri = `mongodb+srv://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_CLUSTER}/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};
