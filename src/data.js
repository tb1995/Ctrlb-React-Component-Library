		const imgDirectory = "/img/component-images/"

		export let masterComponentArray = [
		{
		label: "Heroes",
		list: [
				{
					title: "Hero Fullscreen",
					description: "Hero with 100vh and with a CTA",
					url: "/Heroes/Fullscreen",
					imgUrl: imgDirectory + "hero-fullscreen.png",
					dependencies: [],
					listOfProps: []
                },
                {
					title: "Hero Halfscreen",
					description: "Hero with 50vh and with a CTA",
					url: "/Heroes/Halfscreen",
					imgUrl: imgDirectory + "hero-halfscreen.png",
					dependencies: [],
					listOfProps: []
				},
				{
					title: "Hero Two Columns",
					description: "Hero with two columns, one for images",
					url: "/Heroes/TwoColumns",
					imgUrl: imgDirectory + "hero-halfscreen.png",
					dependencies: [],
					listOfProps: []
				}, {
					title: "Hero Fullscreen Center Text",
					description: "Hero Fullscreen with Center Text",
					url: "/Heroes/FullscreenCenterText",
					imgUrl: imgDirectory + "hero-halfscreen.png",
					dependencies: [],
					listOfProps: []
				}

			],
		},
		{
		label: "Grids",
		list: [
			{
				title: "Responsive Grid",
				description: "Specify the number of columns and item width via the props",
				url: "/Grids/Responsive",
				imgUrl: imgDirectory + "responsive-grid.png",
				dependencies: [],
				listOfProps: []
			},
			{
				title: "Responsive Grid More Info",
				description: "Specify the number of columns and item width via the props",
				url: "/Grids/Responsive-Info",
				imgUrl: imgDirectory + "responsive-grid.png",
				dependencies: [],
				listOfProps: []
			},
			{
				title: "Responsive Grid Icons",
				description: "Specify the number of columns and item width via the props, uses fixed icon size",
				url: "/Grids/Responsive-Info-Icons",
				imgUrl: imgDirectory + "responsive-grid.png",
				dependencies: [],
				listOfProps: []
			}
		],
        },
        {
            label: "Info Sections",
            list: [
                {
                    title: "Info section 1",
                    description: "image on the left, text block and btn on the right",
                    url: "/Info/1",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				 {
                    title: "Info section 1 Alternate",
                    description: "Has tiny text and different styled button",
                    url: "/Info/1-Alt",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				 {
                    title: "Info section 1 Laterally Reversed",
                    description: "Has tiny text and different styled button, but the orders are switched around",
                    url: "/Info/1-Reversed",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				 {
                    title: "Info section 2x2 Grids",
                    description: "Has tiny text and different styled button, with 2x2 Grid",
                    url: "/Info/Grids",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				{
                    title: "Info section With Form",
                    description: "Has a form with the info section",
                    url: "/Info/Form",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
				},
				{
                    title: "Left Right Sections",
                    description: "Has responsive left right sections",
                    url: "/Info/Left-Right",
                    imgUrl: imgDirectory + "info-1.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
            label: "Tabs",
            list: [
                {
                    title: "Centered Tabs",
                    description: "Tabs",
                    url: "/Tabs/Centered",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				},
				{
                    title: "Bordered Tabs",
                    description: "Tabs bordered KNC",
                    url: "/Tabs/Bordered",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
		label: "Navbars",
		list: [
                {
                    title: "Top Traditional",
                    description: "Top traditional",
                    url: "/Navbar/Traditional",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
		label: "Footers",
		list: [
                {
                    title: "Four Column Footer",
                    description: "Four Column Footer",
                    url: "/Footers/Column-4",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
		label: "Banners",
		list: [
                {
                    title: "Only Button",
                    description: "Contains only a singular button",
                    url: "/Banners/OnlyButton",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				},
				{
                    title: "Paragraph and Button",
                    description: "Contains a paragraph and a button",
                    url: "/Banners/Paragraph-Button",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
                }
            ]
		},
		{
		label: "Forms",
		list: [
                {
                    title: "Form-1",
                    description: "Simple Form",
                    url: "/Forms/Form-1",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				},
            ]
		},
		{
		label: "Galleries",
		list: [
                {
                    title: "Carousel style sliding Gallery",
                    description: "Simple Sliding Gallery",
                    url: "/Galleries/Basic",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				},
				{
                    title: "KnC style 5 columns menu",
                    description: "Simple 5 column Gallery",
                    url: "/Galleries/KNC",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				},
				{
                    title: "Slider Gallery",
                    description: "Simple Slider Gallery",
                    url: "/Galleries/Slider",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				},
            ]
		},
		{
			label: "Contentful",
			list: [
				{
					title: "Contentful Events",
                    description: "Events coming from eventful",
                    url: "/contentful/events",
                    imgUrl: imgDirectory + "Centered-Tabs.png",
                    dependencies: [],
                    listOfProps: []
				}
			]
		}

	]
	
	export let navbarArray = [
		{
			label: "About",
			url: ""
		},
		{
			label: "Locations",
			url: ""
		},
		{
			label: "Private Dining",
			url: ""
		},
		{
			label: "Galleries",
			url: ""
		},
		{
			label: "Menus",
			url: ""
		},
		{
			label: "Contact",
			url: ""
		},
	]

	export let iconList = [
		{
			label: "090078601",
			iconUrl: "/img/logo.png",
			iconAlt: ""

		},
		{
			label: "holmes@consultingdetective.com",
			iconUrl: "/img/logo.png",
			iconAlt: ""
		},
		{
			label: "22B Baker Street, ",
			iconUrl: "/img/logo.png",
			iconAlt: ""
		},
	]


	export let responsiveListMoreInfoList =  [
				{
					title: "Hero Fullscreen",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: imgDirectory + "hero-fullscreen.png",
					buttonText: "Go to Hero Fullscreen",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                },
                {
					title: "Hero Fullscreen 2",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: imgDirectory + "hero-fullscreen.png",
					buttonText: "Go to Hero Fullscreen 2",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
				},
				
			]

	export let responsiveListIconList =  [
				{
					title: "Hero Fullscreen",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: "/img/logo.png",
					buttonText: "Go to Hero Fullscreen",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                },
                {
					title: "Hero Fullscreen 2",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: "/img/logo.png",
					buttonText: "Go to Hero Fullscreen 2",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
				},
				{
					title: "Hero Fullscreen 3",
					description: "Hero with 100vh and with a CTA",
					url: "",
					imgUrl: "/img/logo.png",
					buttonText: "Go to Hero Fullscreen 3",
					buttonUrl: "#",
					paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
				},
				
			]

	export let fourGrids = [
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
		{
			heading: "I am a fact",
			paragraph: "Lorem ipsum dolor sit amet"
		},
	]


	export let images = [
		{
			src: "/img/gallery/1.jpg",
			alt: "image alt",
			id: 1
		},
		{
			src: "/img/gallery/2.jpg",
			alt: "image alt",
			id: 2
		},
		{
			src: "/img/gallery/3.jpg",
			alt: "image alt",
			id: 3
		},
		{
			src: "/img/gallery/4.jpg",
			alt: "image alt",
			id: 4
		},
		{
			src: "/img/gallery/5.jpg",
			alt: "image alt",
			id: 5
		},
		{
			src: "/img/gallery/6.jpg",
			alt: "image alt",
			id: 6
		},
		{
			src: "/img/gallery/7.jpg",
			alt: "image alt",
			id: 7
		},
		{
			src: "/img/gallery/8.jpg",
			alt: "image alt",
			id: 8
		},
		{
			src: "/img/gallery/9.jpg",
			alt: "image alt",
			id: 9
		},
		{
			src: "/img/gallery/10.jpg",
			alt: "image alt",
			id: 10
		},
		{
			src: "/img/gallery/11.jpg",
			alt: "image alt",
			id: 11
		},
	]


	export let kncImages = [
		{
			src: "/img/sample-images/Santa-Clara.jpg",
			alt: "image alt",
			caption: "Santa Clara"
		},
		{
			src: "/img/sample-images/Cupertino.jpg",
			alt: "image alt",
			caption: "Cupertino"
		},
		{
			src: "/img/sample-images/MCA-Mosque.jpg",
			alt: "image alt",
			caption: "MCA Mosque"
		},
		{
			src: "/img/sample-images/Santa-Clara-Kettlee.jpg",
			alt: "image alt",
			caption: "Santa Clara Kettlee"
		},
		{
			src: "/img/sample-images/Catering.jpg",
			alt: "image alt",
			caption: "Catering"
		}
	]



	export let overlayData = [
		{
			backgroundImageUrl: "/img/overlay-banner.img",
			overlayTitle: "Opening Hours",
			column1TopText: "KnC Santa Clara",
			column1MiddleText: "123 Anywhere Street \nSanta Something, CA",
			column1BottomText: "(415) 555 1234",
			column2TopText: "Monday to Friday \n11 am - 11 pm",
			column2MiddleText: "",
			column2BottomText: "Weekends \n11 am - 12 am",
		}
	]