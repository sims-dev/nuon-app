import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

const SelectContext = React.createContext();

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ selectedValue, handleSelect, isOpen, setIsOpen, children }}>
      <View style={styles.container}>
        {children}
      </View>
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ children, className, ...props }) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <TouchableOpacity
      style={styles.trigger}
      onPress={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

const SelectValue = ({ placeholder }) => {
  const { selectedValue, children } = React.useContext(SelectContext);

  // Find the selected item text
  const selectedItem = React.Children.toArray(children)
    .find(child => child.type === SelectContent)
    ?.props.children.find(item => item.props.value === selectedValue);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
      <Text style={styles.value}>
        {selectedItem ? selectedItem.props.children : placeholder}
      </Text>
      <ChevronDown size={16} color="#6B7280" />
    </View>
  );
};

const SelectContent = ({ children }) => {
  const { isOpen, setIsOpen, handleSelect } = React.useContext(SelectContext);

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setIsOpen(false)}
      >
        <View style={styles.content}>
          <FlatList
            data={React.Children.toArray(children)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item.props.value)}
              >
                <Text style={styles.itemText}>{item.props.children}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const SelectItem = ({ children, value }) => {
  // This component is just a data holder, rendered in SelectContent
  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '50%',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemText: {
    fontSize: 16,
    color: '#111827',
  },
});

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
export default Select;