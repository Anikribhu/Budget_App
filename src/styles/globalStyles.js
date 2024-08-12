import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:0,
    backgroundColor: '#F8F9FA', 
    justifyContent:"center"
  },
  input: {
    borderWidth: 1,
    borderColor: '#CED4DA', 
    padding: 15,
    fontSize: 16,
    borderRadius: 10, 
    marginBottom: 15,
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  button: {
    backgroundColor: '#28A745', 
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2, 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  header: {
    fontSize: 26, 
    fontWeight: '700', 
    marginBottom: 20,
    color: '#212529',
  },
});
