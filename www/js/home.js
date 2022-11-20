var db = null;
var newData = true;

document.addEventListener('deviceready', 
	function() 
	{
		db = window.sqlitePlugin.openDatabase({
		name: 'my.db',
		location: 'default',
	});
	
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS latoff (ktp text primary key, nama text, alamat text)');
	}, function(error) {
			console.log('Transaction ERROR: ' + error.message);
	}, function() {
			console.log('Created database OK');
			getData();
	});
	
});

function resetPage()
{
	document.getElementById("noKtp").value = "";
	document.getElementById("nama").value = "";
	document.getElementById("alamat").value = "";
	newData = true;
	document.getElementById("noKtp").disabled = false;
}

function insertData()
{
	var ktp = document.getElementById("noKtp").value;
	var nama = document.getElementById("nama").value;
	var alamat = document.getElementById("alamat").value;

	if ( newData == true )
	{
		db.transaction(function(tx) {
			tx.executeSql('INSERT INTO latoff VALUES (?1, ?2, ?3)', [ktp, nama, alamat]);
		}, function(error) {
				alert('Transaction ERROR: ' + error.message);
		}, function() {
				alert('Data Terimpan');
				resetPage();
				getData();
		});
	}else
	{
		db.transaction(function(tx) {
			var query = "UPDATE latoff SET nama = ?1, alamat = ?2 WHERE ktp = ?3";
			tx.executeSql( query, [nama, alamat, ktp], 
			function(tx, res) {
				alert("Data terupdate!!!");
				resetPage();
				getData();
			},
			function(tx, error) {
				console.log('UPDATE error: ' + error.message);
			});
		});
	}
}

function removeData( ktp )
{
	db.transaction(function(tx) {
		
		tx.executeSql( "DELETE FROM latoff WHERE ktp = ?", [ ktp ],
		function(tx, res) {
			alert("Data terhapus!!!");
			resetPage();
			getData();
		},
		function(tx, error) {
			console.log('REMOVE DATA error: ' + error.message);
		});
	});
	
}


function isiKolom( ktp )
{
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM latoff', [], function(tx, rs) {		
		
		for ( i = 0; i < rs.rows.length; i++ )
		{
			if ( ktp == rs.rows.item(i).ktp )
			{
				document.getElementById("noKtp").value = ktp;
				document.getElementById("nama").value = rs.rows.item(i).nama;
				document.getElementById("alamat").value = rs.rows.item(i).alamat;
				document.getElementById("noKtp").disabled = true;
				break;
			}
		}
		
	}, function(tx, error) {
			console.log('SELECT error: ' + error.message);
		});
	});	
	
	newData = false;
		
}

function getData()
{
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM latoff', [], function(tx, rs) {			

			//alert(rs.rows.item(0).ktp);
			var tbDataCustomer = "<table class=\"centerLabel\" width=\"100%\"><tr class=\"header\"><td width=\"25%\">Kode Ruangan</td><td width=\"25%\">Nama Ruangan</td><td width=\"30%\">Gedung</td><td width\"20%\">Action</td></tr>";
			if ( rs.rows.length != 0 )
			{
				for ( i = 0; i < rs.rows.length; i++ )
				{
					if ( i % 2 == 0 )
					{
						tbDataCustomer += "<tr class=\"oddCell\"><td>" + rs.rows.item(i).ktp + "</td><td>" + rs.rows.item(i).nama + "</td><td>" + rs.rows.item(i).alamat + "</td><td><button style=\"height: 25px; background-color:red \"  color:'white' onclick=\"removeData(" + rs.rows.item(i).ktp + ")\">HAPUS</button></td></tr>";
					}else
					{
						tbDataCustomer += "<tr class=\"evenCell\"><td>" + rs.rows.item(i).ktp + "</td><td>" + rs.rows.item(i).nama + "</td><td>" + rs.rows.item(i).alamat + "</td><td><button style=\"height: 25px; background-color:red \"  color:'white' onclick=\"removeData(" + rs.rows.item(i).ktp + ")\">HAPUS</button></td></tr>";
					}
				}
			}else
			{
				tbDataCustomer += "<tr><td colspan=4>Data Tidak Ditemukan</td></tr>";
			}
			tbDataCustomer += "</table>";
			
			document.getElementById("dataCustomer").innerHTML = tbDataCustomer;
	}, function(tx, error) {
			console.log('SELECT error: ' + error.message);
		});
	});
}