import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useState } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Task = () => {
  const [activeTab, setActiveTab] = useState('Active')
  
  // Enhanced task data with more variety
  const allTasks = [
    { id: 1, title: 'Join Tonstation', reward: 5000, status: 'claim', type: 'social', icon: 'group' },
    { id: 2, title: 'Follow on Twitter', reward: 2500, status: 'join', type: 'social', icon: 'campaign' },
    { id: 3, title: 'Join Telegram', reward: 5000, status: 'claim', type: 'social', icon: 'chat' },
    { id: 4, title: 'Share with Friends', reward: 1000, status: 'claim', type: 'referral', icon: 'share' },
    { id: 5, title: 'Complete Daily Check-in', reward: 500, status: 'join', type: 'daily', icon: 'check-circle' },
    { id: 6, title: 'Watch Tutorial Video', reward: 3000, status: 'join', type: 'education', icon: 'play-circle-filled' },
  ]
  
  const completedTasks = [
    { id: 7, title: 'Download App', reward: 1000, status: 'completed', type: 'onboarding', icon: 'download' },
    { id: 8, title: 'Create Account', reward: 2000, status: 'completed', type: 'onboarding', icon: 'person-add' },
  ]
  
  const tasks = activeTab === 'Active' ? allTasks : completedTasks

  const handleTaskAction = (taskId: number, action: string) => {
    console.log(`Task ${taskId} - Action: ${action}`)
    // Add your task action logic here
    // Make sure you're not calling any navigation methods here unless properly set up
  }

  const TaskItem = ({ task }: { task: any }) => (
    <View className="flex-row items-center justify-between py-4 mb-5 bg-neutral-950 rounded-xl border-b border-neutral-900 ">
      {/* Task Icon and Info */}
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-black rounded-lg mr-3 justify-center items-center">
          <MaterialIcons name={task.icon as any} size={20} color={'white'} />
        </View>
        
        <View className="flex-1">
          <Text className="text-white text-base font-medium mb-1" style={{fontFamily: 'HankenGrotesk_500Medium'}}>
            {task.title}
          </Text>
          <Text className="text-neutral-400 text-sm" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            +{task.reward.toLocaleString()} Kubot
          </Text>
        </View>
      </View>
      
      {/* Action Button */}
      <TouchableOpacity
        onPress={() => handleTaskAction(task.id, task.status)}
        className={`px-6 py-2 rounded-full ${
          task.status === 'join' 
            ? 'bg-blue-500' 
            : task.status === 'claim'
            ? 'bg-transparent border border-blue-500'
            : 'bg-gray-600'
        }`}
      >
        <Text 
          className={`text-sm font-medium ${
            task.status === 'join' 
              ? 'text-white' 
              : task.status === 'claim'
              ? 'text-blue-500'
              : 'text-gray-300'
          }`}
          style={{fontFamily: 'HankenGrotesk_500Medium'}}
        >
          {task.status === 'join' ? 'Join' : task.status === 'claim' ? 'Claim' : 'Completed'}
        </Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0a0a0a' }}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="py-8 pt-12">
          <Text className="text-2xl font-bold text-white text-center mb-3" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
            Task
          </Text>
          <Text className="text-neutral-400 text-center text-lg leading-6" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
            Get Rewarded for{'\n'}Completing a task
          </Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row mb-4 bg-neutral-900 rounded-2xl p-1.5 border border-neutral-800">
          <TouchableOpacity
              onPress={() => setActiveTab('Active')}
              className={`flex-1 py-4 rounded-xl ${
                activeTab === 'Active' ? 'bg-[#016FEC] shadow-lg' : 'bg-transparent'
              }`}
            >
              <Text 
                className={`text-center font-semibold text-base ${
                  activeTab === 'Active' ? 'text-white' : 'text-neutral-400'
                }`}
                style={{fontFamily: 'HankenGrotesk_600SemiBold'}}
              >
                Active
              </Text>
          </TouchableOpacity>

          <TouchableOpacity
              onPress={() => setActiveTab('Completed')}
              className={`flex-1 py-4 rounded-xl ${
                activeTab === 'Completed' ? 'bg-[#016FEC] shadow-lg' : 'bg-transparent'
              }`}
            >
              <Text 
                className={`text-center font-semibold text-base ${
                  activeTab === 'Completed' ? 'text-white' : 'text-neutral-400'
                }`}
                style={{fontFamily: 'HankenGrotesk_600SemiBold'}}
              >
                Completed
              </Text>
          </TouchableOpacity>
        </View>

        {/* Task Stats Banner */}
        {activeTab === 'Active' && (
          <View className="bg-neutral-900  border border-neutral-800 rounded-2xl px-6 py-3 mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-green-500 text-2xl text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                  {tasks.filter(t => t.status === 'claim').length}
                </Text>
                <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                  Ready to Claim
                </Text>
              </View>
              <View>
                <Text className="text-green-500 text-2xl text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                  {tasks.filter(t => t.status === 'join').length}
                </Text>
                <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                  Available Tasks
                </Text>
              </View>
              <View>
                <Text className="text-green-500 text-lg text-center font-bold" style={{fontFamily: 'HankenGrotesk_700Bold'}}>
                  {tasks.reduce((sum, task) => sum + task.reward, 0).toLocaleString()}
                </Text>
                <Text className="text-neutral-300 text-xs" style={{fontFamily: 'HankenGrotesk_400Regular'}}>
                  Total Rewards
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Task List */}
        <View className="pb-6">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Task