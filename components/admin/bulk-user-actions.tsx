"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Download, Users } from "lucide-react"

interface BulkUserActionsProps {
  onBulkImport: (users: any[]) => void
  onBulkExport: () => void
}

export default function BulkUserActions({ onBulkImport, onBulkExport }: BulkUserActionsProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [csvData, setCsvData] = useState("")
  const [importPreview, setImportPreview] = useState<any[]>([])

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setCsvData(text)
        parseCSV(text)
      }
      reader.readAsText(file)
    }
  }

  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    if (lines.length < 2) return

    const headers = lines[0].split(",").map((h) => h.trim())
    const users = lines
      .slice(1)
      .map((line, index) => {
        const values = line.split(",").map((v) => v.trim())
        const user: any = {
          id: `import-${Date.now()}-${index}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar_url: "/placeholder.svg?height=40&width=40",
        }

        headers.forEach((header, i) => {
          const value = values[i] || ""
          switch (header.toLowerCase()) {
            case "full_name":
            case "name":
              user.full_name = value
              break
            case "email":
              user.email = value
              break
            case "phone":
              user.phone = value
              break
            case "role":
              user.role = ["admin", "provider", "client"].includes(value.toLowerCase()) ? value.toLowerCase() : "client"
              break
            case "is_approved":
            case "approved":
              user.is_approved = value.toLowerCase() === "true" || value === "1"
              break
            case "bio":
              user.bio = value
              break
            case "location":
              user.location = value
              break
            default:
              user[header] = value
          }
        })

        // Set default password for imported users
        user.password = "imported123"

        return user
      })
      .filter((user) => user.full_name && user.email)

    setImportPreview(users)
  }

  const handleBulkImport = () => {
    if (importPreview.length > 0) {
      onBulkImport(importPreview)
      setIsImportDialogOpen(false)
      setCsvData("")
      setImportPreview([])
    }
  }

  const generateSampleCSV = () => {
    const sampleData = `full_name,email,phone,role,is_approved,location,bio
John Doe,john@example.com,+1234567890,client,true,New York,Sample client user
Jane Smith,jane@example.com,+1234567891,provider,false,Los Angeles,Professional hair stylist
Admin User,admin@example.com,+1234567892,admin,true,San Francisco,System administrator`

    const blob = new Blob([sampleData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_users.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onBulkExport}>
        <Download className="h-4 w-4 mr-2" />
        Export Users
      </Button>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Import Users</DialogTitle>
            <DialogDescription>
              Import multiple users from a CSV file. Download the sample template to see the required format.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={generateSampleCSV}>
                <Download className="h-4 w-4 mr-2" />
                Download Sample CSV
              </Button>
              <div className="text-sm text-gray-600">Use this template to format your user data correctly</div>
            </div>

            <div>
              <Label htmlFor="csv-upload">Upload CSV File</Label>
              <Input id="csv-upload" type="file" accept=".csv" onChange={handleCSVUpload} className="mt-2" />
            </div>

            {csvData && (
              <div>
                <Label>CSV Data Preview</Label>
                <Textarea
                  value={csvData}
                  onChange={(e) => {
                    setCsvData(e.target.value)
                    parseCSV(e.target.value)
                  }}
                  rows={6}
                  className="mt-2 font-mono text-sm"
                />
              </div>
            )}

            {importPreview.length > 0 && (
              <div>
                <Label>Import Preview ({importPreview.length} users)</Label>
                <div className="mt-2 max-h-60 overflow-y-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(0, 10).map((user, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{user.full_name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2 capitalize">{user.role}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                user.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.is_approved ? "Approved" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importPreview.length > 10 && (
                    <div className="p-2 text-center text-gray-500 text-sm">
                      ... and {importPreview.length - 10} more users
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkImport} disabled={importPreview.length === 0}>
                <Users className="h-4 w-4 mr-2" />
                Import {importPreview.length} Users
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
