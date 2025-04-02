import { useState } from 'react'
import { MoreHorizontal, ChevronDown, Star, MessageCircle, ChevronLeft, ChevronRight, Heart, Gift, Box, Droplet, Check, X } from 'lucide-react'

const leftCellContents = [
  "草莓", "桃子", "葡萄", "橙子", "甜瓜",
  "玫瑰", "百合", "忍冬", "牵牛花", "风信子",
  "甘草", "玫瑰花", "红枣", "枸杞", "洛神花"
]

const rightCellContents = [
  { icon: Box, label: "Treasure Box" },
  { icon: Droplet, label: "Healing Powder" }
]

export default function Component() {
  const [showV1Interface, setShowV1Interface] = useState(false)
  const [showEventHistory, setShowEventHistory] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(true)

  const handleCellClick = () => {
    setShowV1Interface(true)
  }

  const handleBackClick = () => {
    setShowV1Interface(false)
  }

  const toggleEventHistory = () => {
    setShowEventHistory(!showEventHistory)
  }

  const toggleCalendarCollapse = () => {
    setIsCalendarCollapsed(!isCalendarCollapsed)
  }

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1))
  }

  const renderLeftCell = (index: number) => {
    if (index < leftCellContents.length) {
      return (
        <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex items-center justify-center text-xs text-center p-1" onClick={handleCellClick}>
          {leftCellContents[index]}
          <Star className="absolute top-0 left-0 w-3 h-3 text-yellow-400" />
        </div>
      )
    }
    return <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500">Empty</div>
  }

  const renderRightCell = (index: number) => {
    if (index < rightCellContents.length) {
      const { icon: Icon, label } = rightCellContents[index]
      return (
        <div className="relative w-full pb-[100%] bg-gradient-to-br from-orange-500 to-yellow-500 rounded-md">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
            <div className="text-xs text-white mt-1">{label}</div>
          </div>
        </div>
      )
    }
    return <div className="w-full pb-[100%] bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500">Empty</div>
  }

  const renderCalendarDay = (day: number, isGood: boolean) => {
    const bgColor = isGood ? 'bg-green-200' : 'bg-gray-200'
    const icon = isGood ? <Check className="w-6 h-6 text-green-600" /> : <X className="w-6 h-6 text-red-600" />
    return (
      <div className={`w-8 h-8 ${bgColor} rounded-md flex items-center justify-center relative`} title={`Day ${day}: ${isGood ? 'Good' : 'Bad'} Progress`}>
        <span className="text-xs absolute top-0 left-1">{day}</span>
        {icon}
      </div>
    )
  }

  const renderCalendar = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const startingDay = firstDayOfMonth.getDay()

    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isCurrentDay = today.getDate() === i && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()
      days.push(
        <div
          key={i}
          className={`w-8 h-8 rounded-md flex items-center justify-center relative ${
            isCurrentDay ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {i}
        </div>
      )
    }

    return days
  }

  if (showV1Interface) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
        <div className="w-full max-w-md bg-gradient-to-b from-teal-900 to-teal-700 rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-center px-4 py-2 bg-black/50">
            <div>13:38 ☾</div>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
              <div className="w-4 h-4 bg-white rounded-full"></div>
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="relative p-4">
            <button onClick={handleBackClick} className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="absolute top-2 right-2 bg-green-600 text-xs px-2 py-1 rounded-full">仙友</div>
            <img src="/placeholder.svg?height=300&width=300" alt="Fox Spirit Character" className="mx-auto w-64 h-64 object-cover" />
            <div className="absolute bottom-4 left-4 bg-blue-500 text-xs px-2 py-1 rounded-full">普通</div>
            <div className="absolute top-2 right-12">
              <ChevronLeft className="w-6 h-6" />
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

          <div className="px-4 py-2 bg-white/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-red-500 mr-2" />
                <div className="text-xl font-bold">60</div>
              </div>
              <div className="text-sm">13/25</div>
            </div>
            <div className="mt-2 h-2 bg-gray-300 rounded-full">
              <div className="h-full w-1/2 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <div className="px-4 py-2 bg-white/5 text-sm">
            <p>好感度等级达到80级</p>
            <p className="text-yellow-300">战斗天赋:暴击+20%</p>
            <p className="text-green-300">自动链炼时获得指向属性概率提升20%。</p>
          </div>

          <div className="px-4 py-2 flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="w-10 h-10 bg-purple-500 rounded"></div>
              <div className="w-10 h-10 bg-yellow-500 rounded"></div>
              <div className="w-10 h-10 bg-pink-500 rounded"></div>
            </div>
            <button className="bg-yellow-500 text-black font-bold py-2 px-4 rounded">
              赠礼
            </button>
          </div>

          <div className="flex justify-around py-2 bg-black/50">
            <div className="text-center">
              <Gift className="w-6 h-6 mx-auto" />
              <span className="text-xs">送礼</span>
            </div>
            <div className="text-center">
              <MoreHorizontal className="w-6 h-6 mx-auto" />
              <span className="text-xs">更多</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-900 text-white font-sans">
      <div className="w-full max-w-md bg-gradient-to-b from-teal-800 to-teal-600 rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center justify-between p-2 bg-gray-800/50">
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg?height=40&width=40" alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="text-sm font-bold">毕史森星君</div>
              <div className="text-xs">
                <span className="text-green-400">$</span> 11227 
                <span className="text-blue-400 ml-2">💧</span> 985811
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-red-500 text-sm">妖火 2620.18万</div>
            <MoreHorizontal className="w-6 h-6" />
            <div className="w-6 h-6 rounded-full bg-gray-600"></div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1 p-2 bg-teal-700/50">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="relative">
              <div className="w-full pb-[100%] bg-teal-600 rounded-md"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="relative bg-gradient-to-b from-teal-500 to-green-400">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20240906-161151%20(2)-00YGNtHt03i314PzCTl6mKfcePRQ2u.jpg" 
            alt="Seed Jar" 
            className="w-full object-contain"
          />
          <button
            onClick={toggleEventHistory}
            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
            aria-label="View Latest Events"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-teal-800/50 p-2 flex justify-between items-center">
          <div className="text-sm">
            <div>2 Streak</div>
            <div>4 Pending Tasks</div>
          </div>
          <div className="text-sm text-right">
            <div>4 Done Tasks</div>
          </div>
        </div>

        <div className="bg-teal-700/50 p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold">Progress Calendar</h3>
            <button 
              onClick={toggleCalendarCollapse} 
              className="text-xs bg-teal-600 px-2 py-1 rounded"
            >
              {isCalendarCollapsed ? 'Expand' : 'Collapse'}
            </button>
          </div>
          {!isCalendarCollapsed && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <button onClick={() => changeMonth(-1)} className="text-sm">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <select
                  value={currentDate.getMonth()}
                  onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                  className="bg-teal-600 text-white text-sm rounded"
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                <button onClick={() => changeMonth(1)} className="text-sm">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs font-bold">{day}</div>
                ))}
                {renderCalendar()}
              </div>
            </div>
          )}
          {isCalendarCollapsed && (
            <div className="grid grid-cols-7 gap-1">
              {[...Array(7)].map((_, i) => renderCalendarDay(i + 1, Math.random() > 0.3))}
            </div>
          )}
        </div>

        <div className="flex bg-gray-800/50 p-2 space-x-2">
          <div className="flex-grow overflow-y-auto h-64">
            <div className="grid grid-cols-4 gap-1">
              {[...Array(16)].map((_, i) => (
                <div key={i}>{renderLeftCell(i)}</div>
              ))}
            </div>
          </div>

          <div className="w-1/3 overflow-y-auto h-64">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i}>{renderRightCell(i)}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-around py-2 bg-gray-800">
          {['Home', 'Diary', 'Challenge', 'Store', 'Setting'].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-8 h-8 mx-auto mb-1 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {showEventHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-teal-800 p-4 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Event History</h2>
              <button onClick={toggleEventHistory} className="text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-600">
                  <th className="text-left py-2">Event</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">Finish Project Report</td>
                  <td className="py-2">Sept 10</td>
                  <td className="py-2 text-yellow-400">In Progress</td>
                </tr>
                <tr>
                  <td className="py-2">Buy Groceries</td>
                  <td className="py-2">Sept 12</td>
                  <td className="py-2 text-green-400">Completed</td>
                </tr>
                <tr>
                  <td className="py-2">Exercise Routine</td>
                  <td className="py-2">Sept 15</td>
                  <td className="py-2 text-gray-400">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
