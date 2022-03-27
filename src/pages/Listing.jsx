import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { MapContainer, Marker, Popup, TileLayer, LayerGroup, Circle/* , FeatureGroup, CircleMarker, Tooltip*/ } from 'react-leaflet'
import /* SwiperCore, */ { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
//import 'swiper/swiper-bundle.css'
import 'swiper/css/bundle'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
//SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])   // for Swiper v.6

const Listing = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  //let center = []
  //const fillBlueOptions = { fillColor: 'blue' }
  //const fillRedOptions = { fillColor: 'red' }
  const greenOptions = { color: 'green', fillColor: 'green', opacity: '.5', weight: '1' /* , fillOpacity: 0.5 */ }
  //const purpleOptions = { color: 'purple' }
  
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        //console.log(docSnap.data())   // the listing data
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  } else /* {
    const { lng, lat } = listing.geolocation
    center = [lat, lng]
  } */

  //console.log(listing.imageUrls[0])
  
  return (
    <main>
      <Helmet>
        <title>{listing.name}</title>
      </Helmet>
      <Swiper 
        modules={[Navigation, Pagination, Scrollbar, A11y]}             // added in Swiper v.8
        slidesPerView={1} 
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        //onSwiper={(swiper) => console.log(swiper)}
        //onSlideChange={() => console.log('slide change')}
        //navigation
      >
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)                           // to see a success note below for 2 sec
          }, 2000)
        }}
      >
        <img src={shareIcon} alt='' />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')          // adds comma for every thousand
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            attributionControl={false}
            //placeholder={<p>Listing Map</p>}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />
            <LayerGroup>
              {/* <Circle center={center} pathOptions={fillBlueOptions} radius={200} /> */}
              <LayerGroup>
                {/* <CircleMarker
                  center={center}
                  pathOptions={greenOptions}
                  radius={30}> */}
                  {/* <Tooltip>{listing.location}</Tooltip> */}
                {/* </CircleMarker> */}
              <Circle
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                pathOptions={greenOptions}
                radius={250}
                //stroke={false}
              >
                {/* <Tooltip direction="top" offset={[0, 20]} opacity={1} permanent >{listing.location}</Tooltip> */}
              </Circle>
            </LayerGroup>
            </LayerGroup>
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]} >
              <Popup>{listing.location}</Popup>
            </Marker>
            {/* <FeatureGroup pathOptions={purpleOptions}>
              <Popup>{listing.location}</Popup>
              <Circle center={center} radius={200} />
            </FeatureGroup> */}
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (                         // will show if this Listing was publised by another registered person
          <Link                                                                 // ..?. - just in case the result it returns null
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing

// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat