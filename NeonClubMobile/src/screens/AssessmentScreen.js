import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { assessmentAPI } from '../services/api';

const AssessmentScreen = ({ navigation }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await assessmentAPI.getAssessments();
      setAssessments(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load assessments');
      console.error('Assessments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (assessment) => {
    try {
      const response = await assessmentAPI.getAssessment(assessment._id);
      setSelectedAssessment(response.data);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
      Alert.alert('Error', 'Failed to load assessment details');
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    const unansweredQuestions = selectedAssessment.questions.filter(
      (_, index) => !answers[index]
    );

    if (unansweredQuestions.length > 0) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await assessmentAPI.submitAssessment(selectedAssessment._id, answers);
      Alert.alert(
        'Assessment Submitted',
        'Your assessment has been submitted successfully!',
        [{ text: 'OK', onPress: () => setSelectedAssessment(null) }]
      );
      loadAssessments(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderAssessmentItem = ({ item }) => (
    <View style={styles.assessmentCard}>
      <Text style={styles.assessmentTitle}>{item.title}</Text>
      <Text style={styles.assessmentDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.assessmentMeta}>
        <Text style={styles.questionCount}>
          {item.questions?.length || 0} questions
        </Text>
        <Text style={styles.duration}>
          {item.duration || 30} minutes
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          item.completed && styles.completedButton
        ]}
        onPress={() => startAssessment(item)}
        disabled={item.completed}
      >
        <Text style={[
          styles.startButtonText,
          item.completed && styles.completedButtonText
        ]}>
          {item.completed ? 'Completed' : 'Start Assessment'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    const question = selectedAssessment.questions[currentQuestion];
    
    return (
      <ScrollView style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1} of {selectedAssessment.questions.length}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[currentQuestion] === option && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(currentQuestion, option)}
            >
              <Text style={[
                styles.optionText,
                answers[currentQuestion] === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
            onPress={previousQuestion}
            disabled={currentQuestion === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          {currentQuestion === selectedAssessment.questions.length - 1 ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitAssessment}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navButton}
              onPress={nextQuestion}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading assessments...</Text>
      </View>
    );
  }

  if (selectedAssessment) {
    return (
      <View style={styles.container}>
        <View style={styles.assessmentHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedAssessment(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.assessmentHeaderTitle}>{selectedAssessment.title}</Text>
        </View>
        {renderQuestion()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assessments</Text>
        <Text style={styles.headerSubtitle}>
          Test your knowledge and skills
        </Text>
      </View>

      <FlatList
        data={assessments}
        renderItem={renderAssessmentItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadAssessments}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No assessments available</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={loadAssessments}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  assessmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assessmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  assessmentDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  assessmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionCount: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 12,
    color: '#64748b',
  },
  startButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedButton: {
    backgroundColor: '#10b981',
  },
  completedButtonText: {
    color: '#fff',
  },
  assessmentHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  assessmentHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionHeader: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#1e293b',
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  selectedOptionText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  submitButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AssessmentScreen;