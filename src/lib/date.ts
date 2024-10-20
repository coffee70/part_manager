// formats date to be displayed in the format: "Today", "Yesterday", "1d ago", "2mo ago", "1y ago"
export function formatDate(date: Date): string;
export function formatDate(date: string): string;

export function formatDate(date: Date | string): string {
    const inputDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - inputDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays > 365) {
        const diffYears = Math.floor(diffDays / 365);
        return `${diffYears}y ago`;
    } else if (diffDays > 30) {
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths}mo ago`;
    } else {
        return `${diffDays}d ago`;
    }
}