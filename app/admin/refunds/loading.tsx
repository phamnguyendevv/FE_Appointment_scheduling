import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function RefundsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Stats Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Loading */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="w-full md:w-48 h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Tabs Loading */}
      <div className="space-y-6">
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
          ))}
        </div>

        {/* Cards Loading */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
