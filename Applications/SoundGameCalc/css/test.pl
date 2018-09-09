
my $count = 0;
my $n = 588;
my $p = 0.893;

my $result = calc($n, $p);


while(1) {
	$count ++;
	my $x = calc($n, $p);
	$result = ($result + $x / $count) * ($count /  ($count + 1));

	my $miss = $n / ($result + 1);
	print "Count:" . $count . " Result:" . $x . " Average:" . $result . " Notes:" . ($n - $miss) . "\n";
}



sub calc {
	my ($n, $p) = @_;
	my $maxCombo = 0;
	while($n > 0) {

		my $count = 0;
		while($n > 0) {
			$n --;
			my $r = rand();
			if ($r < $p) {
				$count ++;
			} else {
				last;
			}
		}
		if ($maxCombo < $count) { 
			$maxCombo = $count;
		}
	}
	return $maxCombo;
}