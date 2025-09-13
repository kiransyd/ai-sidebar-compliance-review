"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronDown,
  ChevronUp,
  X,
  Edit3,
  ChevronRight,
  MessageCircle,
  Send,
  Bot,
  Zap,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Paperclip,
  Smile,
  Search,
  Check,
  Eye,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Expand,
  Minimize2,
} from "lucide-react"

// Sample backend response data
const complianceData = {
  total_rules_checked: 16,
  rules_passed: 11,
  rules_failed: 4,
  rules_partial: 1,
  kb_rules_used: true,
  has_bbox: true,
  critical_issues: 3,
  rule_checks: [
    {
      rule_id: "VR-001",
      rule_title: "Presence of Regulatory Address Information",
      status: "PASSED",
      finding: "Found regulatory addresses for USA, Australia, and New Zealand: '3M Company 2510 Conway Avenue St. Paul, MN 55144 USA', '3M Australia Pty Ltd Building A, 1 Rivett Road North Ryde, NSW 2113', '3M New Zealand Ltd 94 Apollo Drive Rosedale, Auckland 0632'",
      location: {
        page: 1,
        text_found: "3M Company 2510 Conway Avenue St. Paul, MN 55144 USA",
        bbox: [365.68, 218.27, 419.62, 230.89]
      },
      compliant: true,
      recommendation: "None"
    },
    {
      rule_id: "VR-002",
      rule_title: "Presence of Regulatory Phone Number",
      status: "FAILED",
      finding: "Found phone number '1-800-537-2192' but required phone number is '1-800-537-2191'",
      location: {
        page: 1,
        text_found: "Questions? 1-800-537-219",
        bbox: [365.68, 194.06, 425.75, 201.38]
      },
      compliant: false,
      recommendation: "Update phone number from '1-800-537-2192' to '1-800-537-2191' as specified in requirements"
    },
    {
      rule_id: "VR-003",
      rule_title: "Presence and Format of Bar Code/UPC/GTIN",
      status: "PASSED",
      finding: "Found required GTIN '34-8726-5740-7' in correct format",
      location: {
        page: 1,
        text_found: "34-8726-5740-7",
        bbox: [365.68, 258.58, 401.91, 265.9]
      },
      compliant: true,
      recommendation: "None"
    },
    {
      rule_id: "VR-004",
      rule_title: "UDI Assessment Requirement – FDA Compliance",
      status: "PASSED",
      finding: "GTIN '34-8726-5740-7' appears to be formatted for FDA UDI Class I compliance and UPC barcode '051131995246' is present",
      location: {
        page: 1,
        text_found: "34-8726-5740-7",
        bbox: [365.68, 258.58, 401.91, 265.9]
      },
      compliant: true,
      recommendation: "None"
    },
    {
      rule_id: "VR-010",
      rule_title: "Recycling Symbol on Packaging",
      status: "FAILED",
      finding: "No recycling symbol found in the document text or mentioned in design assets",
      location: {
        page: 1,
        text_found: "No recycling symbol found",
        bbox: null
      },
      compliant: false,
      recommendation: "Add recycling symbol to packaging design to indicate environmental compliance"
    },
    {
      rule_id: "VR-013",
      rule_title: "Presence of Lot Code or Expiration/Date of Manufacture",
      status: "FAILED",
      finding: "No lot code, expiration date, or date of manufacture found in the required format (LOT/EXP/DOM followed by alphanumeric code)",
      location: {
        page: 1,
        text_found: "No traceability code found",
        bbox: null
      },
      compliant: false,
      recommendation: "Add lot code, expiration date, or date of manufacture in the approved format (e.g., 'LOT: ABCD1', 'EXP: 2F9D2', or 'DOM ABC123')"
    },
    {
      rule_id: "VR-014",
      rule_title: "Trademark Name and Symbol Display",
      status: "PARTIAL",
      finding: "Found 'TM' symbols but not the required '3M™' and 'Nexcare™' format. Found '3M' and 'TM' separately",
      location: {
        page: 1,
        text_found: "TM",
        bbox: [189.96, 154.49, 195.57, 160.19]
      },
      compliant: false,
      recommendation: "Ensure both '3M™' and 'Nexcare™' appear with proper trademark symbols attached directly to the brand names"
    }
  ]
}

export default function HomePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(1)
  const [openReasons, setOpenReasons] = useState<Set<number>>(new Set())
  const [openMarkups, setOpenMarkups] = useState<Set<number>>(new Set())
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hi! I'm Pixl, your compliance assistant. I can help you understand FDA requirements and fix any issues with your product label. What would you like to know?",
      timestamp: "2024-01-15T13:42:00Z" // Fixed timestamp to prevent hydration issues
    }
  ])
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed" | "partial">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    firstName: 'User',
    lastName: 'Name',
    initials: 'UN'
  })

  // Calculate statistics
  const totalRules = complianceData.total_rules_checked
  const passedRules = complianceData.rules_passed
  const failedRules = complianceData.rules_failed
  const partialRules = complianceData.rules_partial || 0
  const passRate = Math.round((passedRules / totalRules) * 100)

  // Filter rules based on status
  const filteredRules = complianceData.rule_checks.filter(rule => {
    if (filterStatus === "all") return true
    if (filterStatus === "passed") return rule.status === "PASSED"
    if (filterStatus === "failed") return rule.status === "FAILED"
    if (filterStatus === "partial") return rule.status === "PARTIAL"
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASSED":
        return <CheckCircle className="w-4 h-4 text-[#00BD6F]" />
      case "FAILED":
        return <AlertCircle className="w-4 h-4 text-[#FC4E46]" />
      case "PARTIAL":
        return <Clock className="w-4 h-4 text-[#FFD13C]" />
      default:
        return <Clock className="w-4 h-4 text-[#4D4D4D]" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASSED":
        return "border-[#00BD6F] bg-[#F0F9F4]"
      case "FAILED":
        return "border-[#FC4E46] bg-[#FFF5F5]"
      case "PARTIAL":
        return "border-[#FFD13C] bg-[#FFF9E6]"
      default:
        return "border-[#4D4D4D] bg-[#F5F5F5]"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PASSED":
        return "Passed"
      case "FAILED":
        return "Failed"
      case "PARTIAL":
        return "Partial"
      default:
        return "Unknown"
    }
  }

  // Enhanced UI helper functions
  const getStatusVisual = (status: string) => {
    const visuals: Record<string, { icon: any; color: string; animation: string; bgColor: string }> = {
      'PASSED': { icon: CheckCircle, color: '#00BD6F', animation: 'pulse', bgColor: '#F0F9F4' },
      'FAILED': { icon: AlertCircle, color: '#FC4E46', animation: 'shake', bgColor: '#FFF5F5' },
      'PARTIAL': { icon: Clock, color: '#FFD13C', animation: 'glow', bgColor: '#FFF9E6' }
    }
    return visuals[status] || visuals['PARTIAL']
  }

  const getSeverityLevel = (status: string) => {
    switch (status) {
      case "FAILED":
        return "critical"
      case "PARTIAL":
        return "warning"
      case "PASSED":
        return "success"
      default:
        return "info"
    }
  }

  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Helper function to get consistent timestamp
  const getCurrentTimestamp = () => {
    return new Date().toISOString()
  }

  // Enhanced chat functions inspired by Pixl design
  const generateUserInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return 'UN'
    const firstInitial = firstName.charAt(0).toUpperCase()
    const lastInitial = lastName.charAt(0).toUpperCase()
    return firstInitial + lastInitial
  }

  const setUserName = (firstName: string, lastName: string) => {
    setCurrentUser({
      firstName: firstName || 'User',
      lastName: lastName || 'Name',
      initials: generateUserInitials(firstName, lastName)
    })
  }

  const getContextualResponse = (userMessage: string) => {
    const contextualResponses: Record<string, string> = {
      "Check FDA compliance": "Great question! FDA compliance covers several key areas. What specific product type are you working with? Food, supplements, cosmetics, or medical devices?",
      "Review EU standards": "EU standards can be quite different from FDA requirements. Are you looking at food labeling, cosmetics, or another category? I can help you navigate the specific regulations.",
      "Allergen requirements": "Allergen labeling is crucial for safety. The major allergens that must be declared include milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, and soybeans. What's your specific concern?",
      "Nutrition facts format": "Nutrition facts formatting has specific requirements for font size, spacing, and layout. Are you designing a new label or updating an existing one?",
    }

    for (const [key, response] of Object.entries(contextualResponses)) {
      if (userMessage.toLowerCase().includes(key.toLowerCase())) {
        return response
      }
    }
    
    const responses = [
      "I can help you check that artwork for compliance issues. Could you upload the label image or share the specific requirements you need to verify?",
      "Based on the compliance standards, I've found a few areas that need attention. The allergen information should be bolded, and the nutrition facts need proper spacing.",
      "Perfect! Your label meets all the required standards. The ingredient list is properly formatted and all mandatory information is clearly visible.",
      "I notice this might be for the Australian market. Let me check it against ACCC guidelines and food labeling requirements.",
    ]
    
    const followUpQuestions = [
      "Would you like me to check any specific compliance areas?",
      "Do you have a particular product category in mind?",
      "Should I focus on any specific regulatory body?",
      "Would you like me to review a sample label for you?",
    ]
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)]
    const followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]
    return `${baseResponse}\n\n${followUp}`
  }

  const typeMessage = (message: string) => {
    setIsTyping(true)
    const newMessage = {
      id: chatMessages.length + 1,
      type: "bot" as const,
      message: "",
      timestamp: getCurrentTimestamp()
    }
    setChatMessages(prev => [...prev, newMessage])
    
    let charIndex = 0
    const typingSpeed = 25
    
    const type = () => {
      if (charIndex < message.length) {
        setChatMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, message: message.substring(0, charIndex + 1) }
              : msg
          )
        )
        charIndex++
        setTimeout(type, typingSpeed + Math.random() * 15 - 7)
      } else {
        setIsTyping(false)
      }
    }
    type()
  }

  const askQuestion = (question: string) => {
    setChatMessage(question)
    handleSendMessage()
  }

  const toggleReason = (itemId: number) => {
    const newOpenReasons = new Set(openReasons)
    if (newOpenReasons.has(itemId)) {
      newOpenReasons.delete(itemId)
    } else {
      newOpenReasons.add(itemId)
    }
    setOpenReasons(newOpenReasons)
  }

  const toggleMarkup = (itemId: number) => {
    const newOpenMarkups = new Set(openMarkups)
    if (newOpenMarkups.has(itemId)) {
      newOpenMarkups.delete(itemId)
    } else {
      newOpenMarkups.add(itemId)
    }
    setOpenMarkups(newOpenMarkups)
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: "user" as const,
        message: chatMessage,
        timestamp: getCurrentTimestamp()
      }
      setChatMessages(prev => [...prev, newMessage])
      const userMessage = chatMessage
      setChatMessage("")
      
      // Simulate bot response with enhanced typing animation
      setTimeout(() => {
        const responseContent = getContextualResponse(userMessage)
        typeMessage(responseContent)
      }, 1000 + Math.random() * 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#111111] mb-8">Welcome to GoVisually</h1>
          <Button
            onClick={() => setIsSheetOpen(true)}
            className="bg-[#FC4E46] hover:bg-[#E0453E] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Open label compliance review
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" 
          onClick={() => setIsSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Side Sheet */}
      <div
        className={`
        fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isSheetOpen ? "translate-x-0" : "translate-x-full"}
      `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compliance-summary-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDEDED] bg-white">
            <div className="flex items-center gap-4">
              <h2 id="compliance-summary-title" className="text-xl font-bold text-[#111111]">Compliance summary</h2>
              <Badge variant="outline" className="border-[#0D6ABE] text-[#0D6ABE] bg-[#F3F8FC]">
                FDA requirements
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSheetOpen(false)}
              className="h-8 w-8 p-0 hover:bg-[#F5F5F5] transition-colors"
              aria-label="Close compliance review"
            >
              <X className="h-4 w-4 text-[#4D4D4D]" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 bg-[#F5F5F5] border-b border-[#EDEDED]">
              <p className="text-[#4D4D4D] text-sm leading-relaxed">
                This is a <span className="text-[#0D6ABE] font-medium">food product label</span> for{" "}
                <span className="text-[#0D6ABE] font-medium">Organic Granola Bars</span> manufactured by{" "}
                <span className="text-[#00BD6F] font-medium">Nature's Best Foods</span>. The label requires compliance
                with <span className="text-[#0D6ABE] font-medium">FDA regulations</span> for nutritional labeling,
                ingredient disclosure, and <span className="text-[#0D6ABE] font-medium">allergen warnings</span> under{" "}
                <span className="text-[#0D6ABE] font-medium">21 CFR Part 101</span>.
              </p>
            </div>

            <div className="p-6">
              {/* Enhanced Statistics Overview with Executive Summary */}
              <div className="mb-6">
                {/* Executive Summary - Always Visible */}
                <div className="bg-gradient-to-r from-[#F3F8FC] to-[#F0F9F4] rounded-xl p-6 mb-6 border border-[#E7F0F8]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#111111]">Compliance overview</h3>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#00BD6F]">{passRate}%</div>
                        <div className="text-[#4D4D4D] text-sm">pass rate</div>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#00BD6F"
                            strokeWidth="2"
                            strokeDasharray={`${passRate}, 100`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#00BD6F]">{passRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FC4E46]">{failedRules}</div>
                      <div className="text-xs text-[#4D4D4D]">Critical issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FFD13C]">{partialRules}</div>
                      <div className="text-xs text-[#4D4D4D]">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#0D6ABE]">{totalRules}</div>
                      <div className="text-xs text-[#4D4D4D]">Total rules</div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-[#F5F5F5] rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-[#00BD6F] to-[#7BCDDA] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${passRate}%` }}
                  ></div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-3 bg-[#F0F9F4] rounded-lg border border-[#00BD6F]/20">
                    <div className="text-xl font-bold text-[#00BD6F]">{passedRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Passed</div>
                  </div>
                  <div className="text-center p-3 bg-[#FFF5F5] rounded-lg border border-[#FC4E46]/20">
                    <div className="text-xl font-bold text-[#FC4E46]">{failedRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Failed</div>
                  </div>
                  <div className="text-center p-3 bg-[#FFF9E6] rounded-lg border border-[#FFD13C]/20">
                    <div className="text-xl font-bold text-[#FFD13C]">{partialRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Partial</div>
                  </div>
                  <div className="text-center p-3 bg-[#F3F8FC] rounded-lg border border-[#0D6ABE]/20">
                    <div className="text-xl font-bold text-[#0D6ABE]">{totalRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Total</div>
                  </div>
                </div>

                {/* Enhanced Filter System with Smart Search */}
                <div className="space-y-4">
                  {/* Smart Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4D4D4D] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search rules, violations, or recommendations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BCDDA] focus:border-transparent"
                    />
                  </div>
                  
                  {/* Visual Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("all")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "all" 
                          ? "bg-[#0D6ABE] text-white shadow-md" 
                          : "border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]"
                      }`}
                    >
                      All ({totalRules})
                    </Button>
                    <Button
                      variant={filterStatus === "failed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("failed")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "failed" 
                          ? "bg-[#FC4E46] text-white shadow-md" 
                          : "border-[#FC4E46] text-[#FC4E46] hover:bg-[#FFF5F5]"
                      }`}
                    >
                      Critical ({failedRules})
                    </Button>
                    <Button
                      variant={filterStatus === "passed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("passed")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "passed" 
                          ? "bg-[#00BD6F] text-white shadow-md" 
                          : "border-[#00BD6F] text-[#00BD6F] hover:bg-[#F0F9F4]"
                      }`}
                    >
                      Passed ({passedRules})
                    </Button>
                    <Button
                      variant={filterStatus === "partial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("partial")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "partial" 
                          ? "bg-[#FFD13C] text-white shadow-md" 
                          : "border-[#FFD13C] text-[#FFD13C] hover:bg-[#FFF9E6]"
                      }`}
                    >
                      Warnings ({partialRules})
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Auto Compliance Check Button */}
              <div className="mb-6">
                <Button 
                  onClick={simulateAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-[#FC4E46] hover:bg-[#E0453E] text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing compliance... {analysisProgress}%
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Auto compliance check
                    </>
                  )}
                </Button>
                
                {/* Progress Bar for Analysis */}
                {isAnalyzing && (
                  <div className="mt-3 w-full bg-[#F5F5F5] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#FC4E46] to-[#FFD13C] h-2 rounded-full transition-all duration-200"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {filteredRules.map((rule, index) => (
                  <div key={rule.rule_id} className={`border rounded-lg overflow-hidden bg-white shadow-sm ${getStatusColor(rule.status)}`}>
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F9F9F9] transition-colors"
                      onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setExpandedItem(expandedItem === index ? null : index)}
                      aria-expanded={expandedItem === index}
                    >
                      <Checkbox id={rule.rule_id} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(rule.status)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded font-mono">{rule.rule_id}</span>
                              </div>
                              <span className="font-medium text-[#111111]">{rule.rule_title.toLowerCase()}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={`${getStatusColor(rule.status)}`}>
                            {getStatusText(rule.status)}
                          </Badge>
                        </div>
                      </div>
                      {expandedItem === index ? (
                        <ChevronUp className="w-4 h-4 text-[#4D4D4D]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#4D4D4D]" />
                      )}
                    </div>

                    {expandedItem === index && (
                      <div className="px-4 pb-4 border-t border-[#EDEDED] bg-[#F9F9F9]">
                        <div className="mt-3 mb-4">
                          <p className="text-[#4D4D4D] text-sm leading-relaxed">
                            {rule.finding}
                          </p>
                          {rule.location.text_found && (
                            <p className="text-[#00BD6F] text-sm mt-2 font-medium">
                              Found: "{rule.location.text_found}" (Page {rule.location.page})
                            </p>
                          )}
                        </div>

                        {rule.recommendation && rule.recommendation !== "None" && (
                          <div className="space-y-3">
                            <div>
                              <div
                                className="flex items-center justify-between py-2 cursor-pointer border-b border-[#EDEDED] hover:bg-[#F5F5F5] rounded px-2 -mx-2"
                                onClick={() => toggleReason(index)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && toggleReason(index)}
                              >
                                <span className="text-[#0D6ABE] font-medium">Reason</span>
                                {openReasons.has(index) ? (
                                  <ChevronUp className="w-4 h-4 text-[#4D4D4D]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#4D4D4D]" />
                                )}
                              </div>
                              {openReasons.has(index) && (
                                <div className="py-3 text-sm text-[#4D4D4D] leading-relaxed">
                                  {rule.status === "FAILED" 
                                    ? "This validation rule failed because the required information is missing, incorrect, or not in the proper format as specified by regulatory requirements."
                                    : rule.status === "PARTIAL"
                                    ? "This validation rule partially passed but requires attention to meet full compliance standards."
                                    : "This validation rule passed all requirements and meets compliance standards."
                                  }
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex items-center justify-between py-2 cursor-pointer border-b border-[#EDEDED] flex-1 hover:bg-[#F5F5F5] rounded px-2 -mx-2"
                                  onClick={() => toggleMarkup(index)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === 'Enter' && toggleMarkup(index)}
                                >
                                  <span className="text-[#0D6ABE] font-medium">Recommendation</span>
                                  {openMarkups.has(index) ? (
                                    <ChevronUp className="w-4 h-4 text-[#4D4D4D]" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#4D4D4D]" />
                                  )}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-transparent border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]"
                                  onClick={() => setIsChatOpen(true)}
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Ask Pixl
                                </Button>
                              </div>
                              {openMarkups.has(index) && (
                                <div className="py-3">
                                  <div className="bg-[#F3F8FC] p-3 rounded text-sm text-[#0D6ABE] mb-3 border border-[#E7F0F8]">
                                    <strong>Recommendation:</strong> {rule.recommendation}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" className="bg-[#FC4E46] hover:bg-[#E0453E] text-white">
                                      Markup
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t border-[#EDEDED] pt-6">
                <h4 className="text-lg font-bold text-[#111111] mb-4">Actions</h4>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setIsChatOpen(true)}
                    className="w-full bg-[#0D6ABE] hover:bg-[#0B5AA1] text-white justify-between transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Chat with Pixl
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#00BD6F] text-[#00BD6F] hover:bg-[#F0F9F4] bg-transparent transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <Send className="w-4 h-4 mr-3" />
                      Send feedback
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#FFD13C] text-[#FFD13C] hover:bg-[#FFF9E6] bg-transparent transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <Bot className="w-4 h-4 mr-3" />
                      Run agent
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#4D4D4D] text-[#4D4D4D] hover:bg-[#F5F5F5] bg-transparent transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-3" />
                      Quick actions
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC] bg-transparent transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-3" />
                      Generate report
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#FC4E46] text-[#FC4E46] hover:bg-[#FFF5F5] bg-transparent transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3" />
                      Share with team
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal - Higher z-index to layer on top */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300" 
          onClick={() => setIsChatOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Interface */}
      <div
        className={`
        fixed top-0 right-0 h-full bg-white shadow-2xl z-[70] transform transition-all duration-300 ease-in-out
        ${isChatOpen ? "translate-x-0" : "translate-x-full"}
        ${isChatExpanded ? "w-full" : "w-[480px]"}
      `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Chat Header with Pixl Avatar */}
          <div className="bg-[#000000] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {/* Pixl Avatar */}
              <div className="w-10 h-10 relative grid grid-cols-6 grid-rows-6 gap-px bg-white/10 rounded-lg overflow-hidden">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white transition-all duration-200"
                    style={{
                      opacity: Math.random() > 0.3 ? 1 : 0.3,
                      animation: isTyping ? 'pulse 1s infinite' : 'none'
                    }}
                  />
                ))}
              </div>
              <div>
                <h2 id="chat-title" className="text-lg font-semibold">Pixl</h2>
                <p className="text-sm opacity-90">
                  {isTyping ? 'Typing...' : 'I\'m here to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserName('Jim', 'Bloggs')}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Demo user names"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatExpanded(!isChatExpanded)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label={isChatExpanded ? "Minimize chat" : "Expand chat"}
              >
                {isChatExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-[#F9F9F9] border-b border-[#EDEDED]">
            <div className={`flex flex-wrap gap-2 ${isChatExpanded ? 'max-w-4xl mx-auto' : ''}`}>
              <button
                onClick={() => askQuestion('Check FDA compliance')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Check FDA compliance
              </button>
              <button
                onClick={() => askQuestion('Review EU standards')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Review EU standards
              </button>
              <button
                onClick={() => askQuestion('Allergen requirements')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Allergen requirements
              </button>
              <button
                onClick={() => askQuestion('Nutrition facts format')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Nutrition facts format
              </button>
            </div>
          </div>

          {/* Enhanced Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isChatExpanded ? 'max-w-4xl mx-auto w-full' : ''}`}>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  msg.type === 'user' 
                    ? 'bg-[#0D6ABE] text-white' 
                    : 'bg-[#F5F5F5] text-[#4D4D4D]'
                }`}>
                  {msg.type === 'user' ? currentUser.initials : 'P'}
                </div>
                
                {/* Message Content */}
                <div className={`max-w-[80%] ${msg.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`relative group ${
                    msg.type === 'user' 
                      ? 'bg-[#FC4E46] text-white' 
                      : 'bg-[#F5F5F5] text-[#111111]'
                  } rounded-2xl px-4 py-3 shadow-sm`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    
                    {/* Copy Button */}
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.message)}
                      className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#EDEDED] hover:bg-[#D1D5DB] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                  <p className={`text-xs mt-1 px-1 ${
                    msg.type === 'user' ? 'text-[#4D4D4D]' : 'text-[#6B7280]'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center text-xs font-semibold text-[#4D4D4D]">
                  P
                </div>
                <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#0D6ABE] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#0D6ABE] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#0D6ABE] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Chat Input */}
          <div className="border-t border-[#EDEDED] p-4 bg-white">
            <div className={`flex items-end gap-3 ${isChatExpanded ? 'max-w-4xl mx-auto' : ''}`}>
              <div className="flex-1 relative">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about compliance..."
                  className="w-full p-3 pr-12 border border-[#EDEDED] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0D6ABE] focus:border-transparent transition-all duration-200"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-3 flex gap-1">
                  <button className="w-6 h-6 bg-[#F5F5F5] hover:bg-[#E5E7EB] rounded-full flex items-center justify-center transition-colors duration-200">
                    <Paperclip className="h-3 w-3 text-[#6B7280]" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                className="w-10 h-10 bg-[#FC4E46] hover:bg-[#E0453E] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
