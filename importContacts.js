import mongoose from 'mongoose';
import Contact from './src/db/models/contact.js';
const contactsData = require('./contacts.json');



const importContacts = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected!');

 
    await Contact.insertMany(contactsData);

    console.log('Contacts have been imported successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing contacts:', error);
    mongoose.connection.close();
  }
};

importContacts();
