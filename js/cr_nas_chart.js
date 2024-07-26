class CR_Nas_Chart{

    type='line';

    load_char(){
        var allData={};
        allData["list_file"]=nas.file.list_file;
        allData["list_link"]=nas.link.list_link;
        const { dates, fileData, linkData } = this.parseData(allData);
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: nas.chart.type,
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'File',
                        data: fileData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false
                    },
                    {
                        label: 'Link',
                        data: linkData,
                        borderColor: '#508D4E',
                        backgroundColor: '#D6EFD8',
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'DD MMM YYYY'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    parseData(data) {
        const parseDate = dateString => new Date(dateString).toISOString().split('T')[0];
        const files = data.list_file.map(file => ({ date: parseDate(file.timeCreated) }));
        const links = data.list_link.map(link => ({ date: parseDate(link.date_create) }));
        const dates = [...new Set([...files.map(file => file.date), ...links.map(link => link.date)])].sort();
        const fileData = dates.map(date => files.filter(f => f.date === date).length);
        const linkData = dates.map(date => links.filter(l => l.date === date).length);
        return { dates, fileData, linkData };
    }

    show_chart_line(){
        this.type="line";
        this.load_char();
    }

    show_chart_bar(){
        this.type="bar";
        this.load_char();
    }
}

var nas_chart=new CR_Nas_Chart();
nas.chart=nas_chart;