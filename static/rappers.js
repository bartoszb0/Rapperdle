function calculateAge(birthYear, birthMonth, birthDay) {
    const today = new Date();
    const birth = new Date(birthYear, birthMonth, birthDay)
    let years = today.getFullYear() - birth.getFullYear()
    if ((today.getMonth() + 1) <= birth.getMonth()) {
        if (today.getDate() < birthDay) {
            years--;
        }
    }
    return years;
}

// TODO
//console.log(calculateAge(2000, 6, 10));

// calculateAge(year, month, day)

const Rappers = [
    {
        name: 'Travis Scott',
        age: calculateAge(1991, 4, 30),
        genre: ['Trap', 'Psychedelic Trap'],
        from: 'Houston, Texas',
        monthly: '60M+',
        debut: '2013',
    },
    {
        name: 'Future',
        age: calculateAge(1983, 11, 20),
        genre: 'Trap',
        from: 'Atlanta, Georgia',
        monthly: '55M+',
        debut: '2012',
    },
    {
        name: 'Lil Wayne',
        age: calculateAge(1982, 9, 27),
        genre: 'Rap',
        from: 'New Orleans, Louisiana',
        monthly: '45M+',
        debut: '1999',
    },
        {
        name: 'Lil Baby',
        age: calculateAge(1994, 12, 3),
        genre: 'Trap',
        from: 'Atlanta, Georgia',
        monthly: '30M+',
        debut: '2017',
    },
];

export default Rappers;