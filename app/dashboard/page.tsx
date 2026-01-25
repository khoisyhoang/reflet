'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useMemo } from 'react'

export default function DashboardPage() {
    const data = useMemo(() => {
        // Daily metrics
        const dailyData = [
            { day: 'Mon', readingTime: 2, sessions: 3, highlights: 10, notes: 5, questions: 4 },
            { day: 'Tue', readingTime: 1, sessions: 2, highlights: 8, notes: 3, questions: 2 },
            { day: 'Wed', readingTime: 3, sessions: 4, highlights: 12, notes: 6, questions: 5 },
            { day: 'Thu', readingTime: 2, sessions: 1, highlights: 6, notes: 4, questions: 3 },
            { day: 'Fri', readingTime: 4, sessions: 5, highlights: 15, notes: 7, questions: 6 },
            { day: 'Sat', readingTime: 3, sessions: 3, highlights: 9, notes: 5, questions: 4 },
            { day: 'Sun', readingTime: 2, sessions: 2, highlights: 7, notes: 3, questions: 2 },
        ]

        // Calculate current reading streak (consecutive days with sessions > 0, from end backwards)
        const currentStreak = (() => {
            let streak = 0
            for (let i = dailyData.length - 1; i >= 0; i--) {
                if (dailyData[i].sessions > 0) streak++
                else break
            }
            return streak
        })()

        // Reading time by hour of day (aggregated)
        const hourlyData = [
            { hour: '0:00', readingTime: 0 },
            { hour: '1:00', readingTime: 0 },
            { hour: '2:00', readingTime: 0 },
            { hour: '3:00', readingTime: 0 },
            { hour: '4:00', readingTime: 0 },
            { hour: '5:00', readingTime: 0 },
            { hour: '6:00', readingTime: 1 },
            { hour: '7:00', readingTime: 2 },
            { hour: '8:00', readingTime: 2 },
            { hour: '9:00', readingTime: 1 },
            { hour: '10:00', readingTime: 1 },
            { hour: '11:00', readingTime: 1 },
            { hour: '12:00', readingTime: 1 },
            { hour: '13:00', readingTime: 0 },
            { hour: '14:00', readingTime: 1 },
            { hour: '15:00', readingTime: 0 },
            { hour: '16:00', readingTime: 1 },
            { hour: '17:00', readingTime: 1 },
            { hour: '18:00', readingTime: 2 },
            { hour: '19:00', readingTime: 2 },
            { hour: '20:00', readingTime: 1 },
            { hour: '21:00', readingTime: 1 },
            { hour: '22:00', readingTime: 0 },
            { hour: '23:00', readingTime: 0 },
        ]

        // Activity distribution (total)
        const totalHighlights = dailyData.reduce((sum, d) => sum + d.highlights, 0)
        const totalNotes = dailyData.reduce((sum, d) => sum + d.notes, 0)
        const totalQuestions = dailyData.reduce((sum, d) => sum + d.questions, 0)
        const activityData = [
            { name: 'Highlights', value: totalHighlights, color: '#8884d8' },
            { name: 'Notes', value: totalNotes, color: '#82ca9d' },
            { name: 'Questions', value: totalQuestions, color: '#ffc658' },
        ]

        // Totals
        const totalReadingTime = dailyData.reduce((sum, d) => sum + d.readingTime, 0)
        const totalSessions = dailyData.reduce((sum, d) => sum + d.sessions, 0)

        // Book-related data
        const booksData = [
            { title: 'The Great Gatsby', pagesRead: 180, totalPages: 180, genre: 'Fiction', author: 'F. Scott Fitzgerald' },
            { title: 'Sapiens', pagesRead: 250, totalPages: 400, genre: 'Non-Fiction', author: 'Yuval Noah Harari' },
            { title: 'Dune', pagesRead: 300, totalPages: 600, genre: 'Sci-Fi', author: 'Frank Herbert' },
            { title: 'Atomic Habits', pagesRead: 200, totalPages: 320, genre: 'Self-Help', author: 'James Clear' },
            { title: '1984', pagesRead: 328, totalPages: 328, genre: 'Dystopian', author: 'George Orwell' },
        ]

        const totalBooksRead = booksData.filter(book => book.pagesRead === book.totalPages).length
        const totalPagesRead = booksData.reduce((sum, book) => sum + book.pagesRead, 0)
        const genreData = booksData.reduce((acc, book) => {
            acc[book.genre] = (acc[book.genre] || 0) + book.pagesRead
            return acc
        }, {} as Record<string, number>)
        const genreChartData = Object.entries(genreData).map(([genre, pages]) => ({ genre, pages }))

        return { dailyData, hourlyData, activityData, totalReadingTime, totalSessions, totalHighlights, totalNotes, totalQuestions, currentStreak, booksData, totalBooksRead, totalPagesRead, genreChartData }
    }, [])
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Reading Analytics Dashboard</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Reading Time</CardDescription>
                        <CardTitle className="text-2xl">{data.totalReadingTime} hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">This week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Sessions</CardDescription>
                        <CardTitle className="text-2xl">{data.totalSessions}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Reading sessions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Highlights Created</CardDescription>
                        <CardTitle className="text-2xl">{data.totalHighlights}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Text highlights</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Notes & Questions</CardDescription>
                        <CardTitle className="text-2xl">{data.totalNotes + data.totalQuestions}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Personal notes and AI queries</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Current Streak</CardDescription>
                        <CardTitle className="text-2xl">{data.currentStreak} days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(data.currentStreak / 7) * 100} className="mt-2" />
                        <p className="text-sm text-muted-foreground">Consecutive days reading</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Books Read</CardDescription>
                        <CardTitle className="text-2xl">{data.totalBooksRead}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Completed this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pages Read</CardDescription>
                        <CardTitle className="text-2xl">{data.totalPagesRead}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Across all books</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Daily Reading Time */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Reading Time</CardTitle>
                        <CardDescription>Hours spent reading each day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.dailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="readingTime" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Sessions per Day */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reading Sessions</CardTitle>
                        <CardDescription>Number of reading sessions per day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.dailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sessions" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Reading Time by Hour */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reading Patterns</CardTitle>
                        <CardDescription>Hours of reading by time of day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="readingTime" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Activity Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Breakdown</CardTitle>
                        <CardDescription>Highlights, notes, and questions this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.activityData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.activityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Reading by Genre */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Reading by Genre</CardTitle>
                        <CardDescription>Pages read across different genres</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.genreChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="genre" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="pages" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
