"use client"

import { useState } from "react"
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
  Sparkles,
} from "lucide-react"
import Link from "next/link"

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
      timestamp: new Date()
    }
  ])
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed" | "partial">("all")

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
        timestamp: new Date()
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length + 2,
          type: "bot" as const,
          message: "I understand your question about the compliance issue. Let me help you with that. Based on the validation rules, I can see that the phone number needs to be updated to match FDA records. Would you like me to provide more specific guidance?",
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, botResponse])
      }, 1000)
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
          <div className="space-y-4">
            <Button
              onClick={() => setIsSheetOpen(true)}
              className="bg-[#FC4E46] hover:bg-[#E0453E] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md block w-full max-w-sm mx-auto"
            >
              Open label compliance review
            </Button>
            <Link href="/mood-orbs">
              <Button
                variant="outline"
                className="border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC] px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md block w-full max-w-sm mx-auto"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Mood Orbs Demo
              </Button>
            </Link>
          </div>
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
              {/* Statistics Overview */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#111111]">Validation results</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#00BD6F]">{passRate}%</span>
                    <span className="text-[#4D4D4D] text-sm">pass rate</span>
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

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className={filterStatus === "all" ? "bg-[#0D6ABE] text-white" : ""}
                  >
                    All ({totalRules})
                  </Button>
                  <Button
                    variant={filterStatus === "failed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("failed")}
                    className={filterStatus === "failed" ? "bg-[#FC4E46] text-white" : "border-[#FC4E46] text-[#FC4E46]"}
                  >
                    Failed ({failedRules})
                  </Button>
                  <Button
                    variant={filterStatus === "passed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("passed")}
                    className={filterStatus === "passed" ? "bg-[#00BD6F] text-white" : "border-[#00BD6F] text-[#00BD6F]"}
                  >
                    Passed ({passedRules})
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-[#FC4E46] hover:bg-[#E0453E] text-white mb-6 font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                <Edit3 className="w-4 h-4 mr-2" />
                Auto compliance check
              </Button>

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
                            <span className="font-medium text-[#111111]">{rule.rule_id}. {rule.rule_title.toLowerCase()}</span>
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
                                      Apply fix
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-[#0D6ABE] border-[#0D6ABE] bg-transparent hover:bg-[#F3F8FC]"
                                    >
                                      Preview <ChevronDown className="w-3 h-3 ml-1" />
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
        fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out
        ${isChatOpen ? "translate-x-0" : "translate-x-full"}
      `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
      >
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDEDED] bg-white">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8 p-0 hover:bg-[#F5F5F5] transition-colors"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4 text-[#4D4D4D]" />
              </Button>
              <div>
                <h2 id="chat-title" className="text-xl font-bold text-[#111111]">Chat with Pixl</h2>
                <p className="text-sm text-[#4D4D4D]">Your compliance assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChatOpen(false)}
              className="h-8 w-8 p-0 hover:bg-[#F5F5F5] transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4 text-[#4D4D4D]" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.type === 'user'
                      ? 'bg-[#0D6ABE] text-white'
                      : 'bg-[#F5F5F5] text-[#111111]'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-[#4D4D4D]'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-[#EDEDED] p-6 bg-white">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Pixl about compliance issues..."
                  className="w-full p-3 border border-[#EDEDED] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7BCDDA] focus:border-transparent"
                  rows={2}
                />
                <div className="absolute right-2 bottom-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-[#F5F5F5]"
                  >
                    <Paperclip className="h-3 w-3 text-[#4D4D4D]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-[#F5F5F5]"
                  >
                    <Smile className="h-3 w-3 text-[#4D4D4D]" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                className="bg-[#FC4E46] hover:bg-[#E0453E] text-white px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
